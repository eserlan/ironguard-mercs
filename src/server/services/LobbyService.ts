import { Service, OnStart } from "@flamework/core";
import { Players, CollectionService } from "@rbxts/services";
import { Events } from "server/events";
import { PartyRoom, PartyMember, MissionMode } from "shared/domain/party/party-types";
import { generatePartyCode } from "shared/algorithms/party/code-generator";
import { RunService } from "./RunService";
import { RunConfig } from "shared/domain/run";
import { ClassService } from "./ClassService";
import { getTime } from "shared/utils/time";

const PORTAL_PROXIMITY_THRESHOLD = 15;
const MAX_SEED_VALUE = 1000000;

@Service({})
export class LobbyService implements OnStart {
	private rooms = new Map<string, PartyRoom>();
	private playerRoomMap = new Map<string, string>(); // PlayerId -> RoomCode
	private soloMercenarySelections = new Map<string, string>(); // PlayerId -> MercenaryId
	private soloGearSelections = new Map<string, Record<string, string>>(); // PlayerId -> Loadout

	constructor(
		private runService: RunService,
		private classService: ClassService,
	) { }

	onStart() {
		Events.CreateParty.connect((player) => this.createParty(player));
		Events.JoinParty.connect((player, code) => this.joinParty(player, code));
		Events.LeaveParty.connect((player) => this.leaveParty(player));
		Events.SelectMercenary.connect((player, mercId) => this.selectMercenary(player, mercId));
		Events.EquipItem.connect((player, slot, gearId) => this.equipItem(player, slot, gearId));
		Events.SetReady.connect((player, ready) => this.setReady(player, ready));
		Events.SetMissionMode.connect((player, mode) => this.setMissionMode(player, mode));
		Events.SetDifficulty.connect((player, difficulty) => this.setDifficulty(player, difficulty));
		Events.StepOnPad.connect((player) => this.stepOnPad(player));
		Events.StepOffPad.connect((player) => this.stepOffPad(player));
		Events.LaunchMission.connect((player) => this.launchMission(player));

		Players.PlayerRemoving.Connect((player) => this.leaveParty(player));
		Players.PlayerAdded.Connect((player) => {
			this.syncUnlocks(player);
		});

		// Sync existing players
		for (const player of Players.GetPlayers()) {
			this.syncUnlocks(player);
		}
	}

	private syncUnlocks(player: Player) {
		const allClassIds = ["shield-saint", "ashblade", "vanguard"];
		const unlocked = allClassIds.filter((id) => this.classService.isClassUnlocked(player.UserId, id));
		Events.UnlockedClassesUpdated.fire(player, unlocked);
	}

	private stepOnPad(player: Player) {
		const playerId = tostring(player.UserId);
		const existingCode = this.playerRoomMap.get(playerId);

		if (existingCode) {
			const room = this.rooms.get(existingCode);
			const member = room?.members.find((m) => m.playerId === playerId);
			if (member) {
				member.isOnPad = true;
				this.broadcastUpdate(room!);
			}
			return;
		}

		// Not in a room, try to join an existing one or create new
		// Simplified: Join the first room that isn't full
		let targetRoom: PartyRoom | undefined;
		for (const [, room] of this.rooms) {
			if (room.members.size() < 4) {
				targetRoom = room;
				break;
			}
		}

		if (targetRoom) {
			this.joinParty(player, targetRoom.code);

			// Verify join succeeded before mutating
			const joinedCode = this.playerRoomMap.get(playerId);
			if (!joinedCode || joinedCode !== targetRoom.code) {
				return;
			}

			const updatedRoom = this.rooms.get(joinedCode);
			if (!updatedRoom) {
				return;
			}

			const member = updatedRoom.members.find((m) => m.playerId === playerId);
			if (member) {
				member.isOnPad = true;
				this.broadcastUpdate(updatedRoom);
			}
		} else {
			this.createParty(player);

			// Verify party was created before proceeding
			const newCode = this.playerRoomMap.get(playerId);
			if (!newCode) {
				return;
			}

			const newRoom = this.rooms.get(newCode);
			if (!newRoom) {
				return;
			}

			const member = newRoom.members.find((m) => m.playerId === playerId);
			if (member) {
				member.isOnPad = true;
				this.broadcastUpdate(newRoom);
			}
		}
	}

	private stepOffPad(player: Player) {
		const playerId = tostring(player.UserId);
		const code = this.playerRoomMap.get(playerId);
		if (!code) return;

		const room = this.rooms.get(code);
		if (!room) return;

		const member = room.members.find((m) => m.playerId === playerId);
		if (member) {
			member.isOnPad = false;
			this.broadcastUpdate(room);
		}
	}

	private createParty(player: Player): boolean {
		this.leaveParty(player); // Ensure clean state

		let code = generatePartyCode();
		while (this.rooms.has(code)) {
			code = generatePartyCode();
		}

		const playerId = tostring(player.UserId);
		const member: PartyMember = {
			playerId: playerId,
			displayName: player.DisplayName,
			isReady: false,
			isOnPad: false,
			selectedMercenaryId: this.soloMercenarySelections.get(playerId),
			loadout: this.soloGearSelections.get(playerId),
		};

		const room: PartyRoom = {
			code: code,
			hostId: playerId,
			mode: MissionMode.Standard,
			difficulty: 1,
			members: [member],
			createdAt: getTime(),
		};

		this.rooms.set(code, room);
		this.playerRoomMap.set(playerId, code);

		Events.PartyCreated.fire(player, code);
		Events.PartyJoined.fire(player, room);
		return true;
	}

	private joinParty(player: Player, code: string) {
		this.leaveParty(player);

		const room = this.rooms.get(code);
		if (!room) {
			return;
		}

		if (room.members.size() >= 4) {
			return; // Full
		}

		const playerId = tostring(player.UserId);
		const member: PartyMember = {
			playerId: playerId,
			displayName: player.DisplayName,
			isReady: false,
			isOnPad: false,
			selectedMercenaryId: this.soloMercenarySelections.get(playerId),
			loadout: this.soloGearSelections.get(playerId),
		};

		room.members.push(member);
		this.playerRoomMap.set(playerId, code);

		Events.PartyJoined.fire(player, room);
		this.broadcastUpdate(room);
	}

	private leaveParty(player: Player) {
		const playerId = tostring(player.UserId);
		const code = this.playerRoomMap.get(playerId);
		if (!code) return;

		this.playerRoomMap.delete(playerId);
		const room = this.rooms.get(code);
		if (!room) return;

		// Preserve selection
		const member = room.members.find((m) => m.playerId === playerId);
		if (member) {
			if (member.selectedMercenaryId) {
				this.soloMercenarySelections.set(playerId, member.selectedMercenaryId);
			}
			if (member.loadout) {
				this.soloGearSelections.set(playerId, member.loadout);
			}
		}

		// Remove member
		const index = room.members.findIndex((m) => m.playerId === playerId);
		if (index !== -1) {
			room.members.remove(index);
		}

		Events.PartyLeft.fire(player);

		if (room.members.size() === 0) {
			// Destroy room if empty
			this.rooms.delete(code);
		} else if (room.hostId === playerId) {
			// Host left - transfer ownership to next member
			room.hostId = room.members[0].playerId;
			this.broadcastUpdate(room);
		} else {
			this.broadcastUpdate(room);
		}
	}

	private selectMercenary(player: Player, mercId: string) {
		const playerId = tostring(player.UserId);
		const room = this.getRoom(player);
		if (room) {
			const member = this.getMember(room, player);
			if (member) {
				member.selectedMercenaryId = mercId;
				this.broadcastUpdate(room);
			}
		} else {
			this.soloMercenarySelections.set(playerId, mercId);
		}
	}

	private equipItem(player: Player, slot: string, gearId: string) {
		const playerId = tostring(player.UserId);
		const room = this.getRoom(player);
		if (room) {
			const member = this.getMember(room, player);
			if (member) {
				if (!member.loadout) member.loadout = {};
				member.loadout[slot] = gearId;
				this.broadcastUpdate(room);
			}
		} else {
			let loadout = this.soloGearSelections.get(playerId);
			if (!loadout) {
				loadout = {};
				this.soloGearSelections.set(playerId, loadout);
			}
			loadout[slot] = gearId;
		}
	}

	private setReady(player: Player, ready: boolean) {
		const room = this.getRoom(player);
		if (!room) return;

		const member = this.getMember(room, player);
		if (member) {
			// Enforce mercenary selection before ready? FR-004
			if (ready && !member.selectedMercenaryId) {
				return;
			}
			member.isReady = ready;
			this.broadcastUpdate(room);
		}
	}

	private setMissionMode(player: Player, mode: string) {
		const room = this.getRoom(player);
		if (!room) return;

		if (room.hostId !== tostring(player.UserId)) return;

		// Validate mode
		if (mode === MissionMode.Standard || mode === MissionMode.Ironman) {
			room.mode = mode as MissionMode;
			this.broadcastUpdate(room);
		}
	}

	private setDifficulty(player: Player, difficulty: number) {
		const room = this.getRoom(player);
		if (!room) return;

		if (room.hostId !== tostring(player.UserId)) return;

		if (difficulty >= 1 && difficulty <= 5) {
			room.difficulty = difficulty;
			this.broadcastUpdate(room);
		}
	}

	private launchMission(player: Player) {
		const playerId = tostring(player.UserId);
		const room = this.getRoom(player);

		// Proximity check
		const portals = CollectionService.GetTagged("LobbyDungeonPortal");
		const character = player.Character;
		if (!character) return;

		let nearPortal = false;
		for (const portal of portals) {
			if (portal.IsA("BasePart")) {
				if (character.GetPivot().Position.sub(portal.Position).Magnitude < PORTAL_PROXIMITY_THRESHOLD) {
					nearPortal = true;
					break;
				}
			}
		}

		if (!nearPortal) {
			warn(`Player ${player.Name} tried to launch but was not near a portal.`);
			return;
		}

		if (room) {
			if (room.hostId !== playerId) return;

			// Validate all ready
			const allReady = room.members.every((m) => m.isReady && m.selectedMercenaryId !== undefined);
			if (!allReady) return;

			const seed = math.random() * MAX_SEED_VALUE;
			const config: RunConfig = {
				seed: seed,
				mode: "ArenaClear",
				missionMode: room.mode,
				difficulty: room.difficulty,
			};

			if (this.runService.startMatch(config, room.members)) {
				this.cleanupRoom(room, seed);
			}
		} else {
			// Solo launch
			const mercId = this.soloMercenarySelections.get(playerId);
			if (!mercId) return;

			const seed = math.random() * MAX_SEED_VALUE;
			const config: RunConfig = {
				seed: seed,
				mode: "ArenaClear",
				missionMode: MissionMode.Standard,
				difficulty: 1,
			};

			const soloMember: PartyMember = {
				playerId: playerId,
				displayName: player.DisplayName,
				selectedMercenaryId: mercId,
				loadout: this.soloGearSelections.get(playerId),
				isReady: true,
				isOnPad: true,
			};

			if (this.runService.startMatch(config, [soloMember])) {
				Events.MissionLaunching.fire(player, seed);
				this.soloMercenarySelections.delete(playerId);
				this.soloGearSelections.delete(playerId);
			}
		}
	}

	private cleanupRoom(room: PartyRoom, seed: number) {
		for (const member of room.members) {
			const memberPlayer = Players.GetPlayerByUserId(tonumber(member.playerId)!);
			if (memberPlayer) {
				Events.MissionLaunching.fire(memberPlayer, seed);
			}
			this.playerRoomMap.delete(member.playerId);
		}
		this.rooms.delete(room.code);
	}

	private getRoom(player: Player): PartyRoom | undefined {
		const code = this.playerRoomMap.get(tostring(player.UserId));
		if (!code) return undefined;
		return this.rooms.get(code);
	}

	private getMember(room: PartyRoom, player: Player): PartyMember | undefined {
		return room.members.find((m) => m.playerId === tostring(player.UserId));
	}

	private broadcastUpdate(room: PartyRoom) {
		for (const member of room.members) {
			const memberPlayer = Players.GetPlayerByUserId(tonumber(member.playerId)!);
			if (memberPlayer) {
				Events.PartyUpdated.fire(memberPlayer, room);
			}
		}
	}
}

import { Service, OnStart } from "@flamework/core";
import { Players, CollectionService } from "@rbxts/services";
import { Events } from "server/events";
import { PartyRoom, PartyMember, MissionMode } from "shared/domain/party/party-types";
import { generatePartyCode } from "shared/algorithms/party/code-generator";
import { RunService } from "./RunService";
import { RunConfig } from "shared/domain/run";

@Service({})
export class LobbyService implements OnStart {
	private rooms = new Map<string, PartyRoom>();
	private playerRoomMap = new Map<string, string>(); // PlayerId -> RoomCode
	private soloMercenarySelections = new Map<string, string>(); // PlayerId -> MercenaryId

	constructor(private runService: RunService) { }

	onStart() {
		Events.CreateParty.connect((player) => this.createParty(player));
		Events.JoinParty.connect((player, code) => this.joinParty(player, code));
		Events.LeaveParty.connect((player) => this.leaveParty(player));
		Events.SelectMercenary.connect((player, mercId) => this.selectMercenary(player, mercId));
		Events.SetReady.connect((player, ready) => this.setReady(player, ready));
		Events.SetMissionMode.connect((player, mode) => this.setMissionMode(player, mode));
		Events.SetDifficulty.connect((player, difficulty) => this.setDifficulty(player, difficulty));
		Events.StepOnPad.connect((player) => this.stepOnPad(player));
		Events.StepOffPad.connect((player) => this.stepOffPad(player));
		Events.LaunchMission.connect((player) => this.launchMission(player));

		Players.PlayerRemoving.Connect((player) => this.leaveParty(player));
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
		for (const [_, room] of this.rooms) {
			if (room.members.size() < 4) {
				targetRoom = room;
				break;
			}
		}

		if (targetRoom) {
			this.joinParty(player, targetRoom.code);
			const member = targetRoom.members.find((m) => m.playerId === playerId);
			if (member) member.isOnPad = true;
			this.broadcastUpdate(targetRoom);
		} else {
			this.createParty(player);
			const newCode = this.playerRoomMap.get(playerId)!;
			const newRoom = this.rooms.get(newCode)!;
			const member = newRoom.members.find((m) => m.playerId === playerId)!;
			member.isOnPad = true;
			this.broadcastUpdate(newRoom);
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
			
			// FR-008: If all members leave pad, or if this player leaves pad in a multi-person party?
			// Spec Story 2 says "Stepping off pad -> leaves party".
			// But Story 1 implies you can be in a state where you aren't on a pad (locker).
			// Let's stick to FR-008: clean up when ALL leave pad.
			const anyOnPad = room.members.some((m) => m.isOnPad);
			if (!anyOnPad) {
				this.leaveParty(player);
			} else {
				// If Story 2 means INDIVIDUAL exit:
				this.leaveParty(player);
			}
		}
	}

	private createParty(player: Player) {
		this.leaveParty(player); // Ensure clean state

		let code = generatePartyCode();
		let attempts = 0;
		while (this.rooms.has(code) && attempts < 10) {
			code = generatePartyCode();
			attempts++;
		}

		if (this.rooms.has(code)) {
			warn("Failed to generate unique party code");
			return;
		}

		const playerId = tostring(player.UserId);
		const member: PartyMember = {
			playerId: playerId,
			displayName: player.DisplayName,
			isReady: false,
			isOnPad: false,
			selectedMercenaryId: this.soloMercenarySelections.get(playerId),
		};

		const room: PartyRoom = {
			code: code,
			hostId: playerId,
			mode: MissionMode.Standard,
			difficulty: 1,
			members: [member],
			createdAt: os.time(),
		};

		this.rooms.set(code, room);
		this.playerRoomMap.set(playerId, code);

		Events.PartyCreated.fire(player, code);
		Events.PartyJoined.fire(player, room);
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
		if (member?.selectedMercenaryId) {
			this.soloMercenarySelections.set(playerId, member.selectedMercenaryId);
		}

		// Remove member
		const index = room.members.findIndex((m) => m.playerId === playerId);
		if (index !== -1) {
			room.members.remove(index);
		}

		Events.PartyLeft.fire(player);

		if (room.members.size() === 0 || room.hostId === playerId) {
			// Destroy room if empty or host left
			this.rooms.delete(code);
			// Notify others if host left
			for (const member of room.members) {
				const memberPlayer = Players.GetPlayerByUserId(tonumber(member.playerId)!);
				if (memberPlayer) {
					Events.PartyLeft.fire(memberPlayer);
					this.playerRoomMap.delete(member.playerId);
				}
			}
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
				if (character.GetPivot().Position.sub(portal.Position).Magnitude < 15) {
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

			const seed = math.random(1000000);
			const config: RunConfig = {
				seed: seed,
				mode: "ArenaClear",
				missionMode: room.mode,
				difficulty: room.difficulty,
			};

			const partyMembers = new Map<Player, string>();
			for (const member of room.members) {
				const p = Players.GetPlayerByUserId(tonumber(member.playerId)!);
				if (p && member.selectedMercenaryId) {
					partyMembers.set(p, member.selectedMercenaryId);
				}
			}

			if (this.runService.startMatch(config, partyMembers)) {
				// Notify and cleanup
				this.cleanupRoom(room);
			}
		} else {
			// Solo launch
			const mercId = this.soloMercenarySelections.get(playerId);
			if (!mercId) return;

			const seed = math.random(1000000);
			const config: RunConfig = {
				seed: seed,
				mode: "ArenaClear",
				missionMode: MissionMode.Standard,
				difficulty: 1,
			};

			const partyMembers = new Map<Player, string>();
			partyMembers.set(player, mercId);

			if (this.runService.startMatch(config, partyMembers)) {
				Events.MissionLaunching.fire(player, seed);
				this.soloMercenarySelections.delete(playerId);
			}
		}
	}

	private cleanupRoom(room: PartyRoom) {
		for (const member of room.members) {
			const memberPlayer = Players.GetPlayerByUserId(tonumber(member.playerId)!);
			if (memberPlayer) {
				Events.MissionLaunching.fire(memberPlayer, room.createdAt); // Use createdAt or seed
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

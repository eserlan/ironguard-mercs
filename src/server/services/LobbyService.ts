import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "server/events";
import { PartyRoom, PartyMember, MissionMode } from "shared/domain/party/party-types";
import { generatePartyCode } from "shared/algorithms/party/code-generator";
import { RunService } from "./RunService";
import { RunConfig } from "shared/domain/run";

@Service()
export class LobbyService implements OnStart {
	private rooms = new Map<string, PartyRoom>();
	private playerRoomMap = new Map<string, string>(); // PlayerId -> RoomCode

	constructor(private runService: RunService) {}

	onStart() {
		Events.CreateParty.connect((player) => this.createParty(player));
		Events.JoinParty.connect((player, code) => this.joinParty(player, code));
		Events.LeaveParty.connect((player) => this.leaveParty(player));
		Events.SelectMercenary.connect((player, mercId) => this.selectMercenary(player, mercId));
		Events.SetReady.connect((player, ready) => this.setReady(player, ready));
		Events.SetMissionMode.connect((player, mode) => this.setMissionMode(player, mode));
		Events.LaunchMission.connect((player) => this.launchMission(player));

		Players.PlayerRemoving.Connect((player) => this.leaveParty(player));
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
		};

		const room: PartyRoom = {
			code: code,
			hostId: playerId,
			mode: MissionMode.Standard,
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
		const room = this.getRoom(player);
		if (!room) return;

		const member = this.getMember(room, player);
		if (member) {
			member.selectedMercenaryId = mercId;
			this.broadcastUpdate(room);
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

	private launchMission(player: Player) {
		const room = this.getRoom(player);
		if (!room) return;

		if (room.hostId !== tostring(player.UserId)) return;

		// Validate all ready
		const allReady = room.members.every((m) => m.isReady && m.selectedMercenaryId !== undefined);
		if (!allReady) return;

		const seed = math.random(1000000);
		const config: RunConfig = {
			seed: seed,
			mode: "ArenaClear",
			missionMode: room.mode,
			difficulty: 1,
		};

		const partyMembers = new Map<Player, string>();
		for (const member of room.members) {
			const p = Players.GetPlayerByUserId(tonumber(member.playerId)!);
			if (p && member.selectedMercenaryId) {
				partyMembers.set(p, member.selectedMercenaryId);
			}
		}

		if (this.runService.startMatch(config, partyMembers)) {
			// Notify clients about launch
			for (const member of room.members) {
				const memberPlayer = Players.GetPlayerByUserId(tonumber(member.playerId)!);
				if (memberPlayer) {
					Events.MissionLaunching.fire(memberPlayer, seed);
				}
			}

			// Cleanup room
			this.rooms.delete(room.code);
			for (const member of room.members) {
				this.playerRoomMap.delete(member.playerId);
			}
		}
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
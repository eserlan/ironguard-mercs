import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "../events";
import { RunStateMachine } from "../../shared/algorithms/run-state";
import { MatchPhase, RunConfig } from "../../shared/domain/run";
import { Log } from "../../shared/utils/log";
import { resolveMissionDeath } from "../../shared/algorithms/permadeath";
import { RosterService } from "./RosterService";
import { SpawnService } from "./SpawnService";
import { DungeonService } from "./DungeonService";
import { PartyMember } from "../../shared/domain/party/party-types";

@Service({})
export class RunService implements OnStart, OnInit {
	private fsm: RunStateMachine | undefined;
	private sessionMembers = new Map<number, PartyMember>(); // UserId -> Session Data

	constructor(
		private rosterService: RosterService,
		private spawnService: SpawnService,
		private dungeonService: DungeonService,
	) { }

	onInit() { }

	onStart() {
		Log.info("RunService started");

		Events.RequestStartRun.connect((_player, _seed) => {
			// Deprecated: runs must now be started via the Lobby system.
			Log.warn("RequestStartRun is deprecated. Use Lobby system.");
		});
	}

	public startMatch(config: RunConfig, members: PartyMember[]) {
		if (this.fsm && this.fsm.getState().phase !== MatchPhase.Lobby) {
			Log.warn("Attempted to start match while one is in progress");
			return false;
		}

		this.fsm = new RunStateMachine(config);

		this.sessionMembers.clear();
		for (const member of members) {
			this.sessionMembers.set(tonumber(member.playerId)!, member);
		}

		if (this.fsm.transition(MatchPhase.Generating)) {
			Log.info(`Match starting! Seed: ${config.seed} Mode: ${config.missionMode}`);

			// 1. Generate World
			const worldResult = this.dungeonService.generate(config.seed);

			// 2. Wrap result in WorldPlan for FSM
			const worldPlan = {
				layout: [], // Physical layout handled by DungeonService spawning
				playerSpawns: worldResult.playerSpawns.map(p => ({ x: p.X, y: p.Y, z: p.Z })),
				enemySpawns: worldResult.enemySpawns.map(p => ({ x: p.X, y: p.Y, z: p.Z }))
			};

			this.fsm.setWorldPlan(worldPlan);
			this.broadcastState();

			task.delay(1, () => {
				if (!this.fsm) return;
				if (this.fsm.transition(MatchPhase.Spawning)) {
					this.broadcastState();

					// 2. Spawn Players
					const players: Player[] = [];
					this.sessionMembers.forEach((_, userId) => {
						const player = game.GetService("Players").GetPlayerByUserId(userId);
						if (player) players.push(player);
					});

					if (worldPlan.playerSpawns.size() > 0) {
						this.spawnService.spawnPlayers(players, worldPlan.playerSpawns);
					} else {
						Log.warn("No player spawns found in world plan!");
					}

					task.delay(1, () => {
						if (!this.fsm) return;
						this.fsm.transition(MatchPhase.Playing);
						this.broadcastState();
					});
				}
			});
			return true;
		} else {
			Log.warn("Cannot start run from current state");
			return false;
		}
	}

	public getSessionMember(userId: number): PartyMember | undefined {
		return this.sessionMembers.get(userId);
	}

	public resolveMission(result: "Victory" | "Defeat") {
		if (!this.fsm) return;

		if (this.fsm.transition(MatchPhase.Ending)) {
			if (result === "Defeat") {
				this.handleDefeat();
			}
			this.broadcastState();
		}
	}

	private handleDefeat() {
		if (!this.fsm) return;
		const state = this.fsm.getState();

		game.GetService("Players").GetPlayers().forEach(player => {
			const member = this.sessionMembers.get(player.UserId);
			const mercId = member?.selectedMercenaryId;
			if (mercId) {
				const roster = this.rosterService.getRoster(player);
				const updatedRoster = resolveMissionDeath(roster, mercId, state.config.missionMode);
				this.rosterService.updateRoster(player, updatedRoster);

				if (state.config.missionMode === "Ironman" && updatedRoster.mercenaries.size() < roster.mercenaries.size()) {
					Log.info(`Mercenary ${mercId} of ${player.Name} was permanently lost.`);
				}
			}
		});
	}

	public isSafeRoom(): boolean {
		if (!this.fsm) return true;
		return this.fsm.getState().phase === MatchPhase.Lobby;
	}

	private broadcastState() {
		if (!this.fsm) return;
		Events.RunStateChanged.broadcast(this.fsm.getState());
	}
}

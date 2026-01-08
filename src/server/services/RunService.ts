import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "../events";
import { RunStateMachine } from "../../shared/algorithms/run-state";
import { MatchPhase, RunConfig } from "../../shared/domain/run";
import { Log } from "../../shared/utils/log";
import { resolveMissionDeath } from "../../shared/algorithms/permadeath";
import { RosterService } from "./RosterService";

@Service({})
export class RunService implements OnStart, OnInit {
	private fsm: RunStateMachine | undefined;
	private activeMercenaries = new Map<number, string>(); // UserId -> MercenaryId

	constructor(private rosterService: RosterService) { }

	onInit() { }

	onStart() {
		Log.info("RunService started");

		Events.RequestStartRun.connect((_player, _seed) => {
			// Deprecated: runs must now be started via the Lobby system.
			Log.warn("RequestStartRun is deprecated. Use Lobby system.");
		});
	}

	public startMatch(config: RunConfig, partyMembers: Map<Player, string>) {
		if (this.fsm && this.fsm.getState().phase !== MatchPhase.Lobby) {
			Log.warn("Attempted to start match while one is in progress");
			return false;
		}

		this.fsm = new RunStateMachine(config);

		this.activeMercenaries.clear();
		for (const [player, mercId] of partyMembers) {
			this.activeMercenaries.set(player.UserId, mercId);
		}

		if (this.fsm.transition(MatchPhase.Generating)) {
			Log.info(`Match starting! Seed: ${config.seed} Mode: ${config.missionMode}`);
			this.broadcastState();

			task.delay(1, () => {
				if (!this.fsm) return;
				this.fsm.transition(MatchPhase.Spawning);
				this.broadcastState();
				task.delay(1, () => {
					if (!this.fsm) return;
					this.fsm.transition(MatchPhase.Playing);
					this.broadcastState();
				});
			});
			return true;
		} else {
			Log.warn("Cannot start run from current state");
			return false;
		}
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
			const mercId = this.activeMercenaries.get(player.UserId);
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
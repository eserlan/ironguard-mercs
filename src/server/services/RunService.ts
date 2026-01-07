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

	constructor(private rosterService: RosterService) {}

	onInit() {}

	onStart() {
		Log.info("RunService started");
		
		Events.RequestStartRun.connect((player, seed) => {
			this.requestStart(player, seed);
		});
	}

	private requestStart(player: Player, seed?: number) {
		if (this.activeMercenaries.has(player.UserId)) {
			Log.warn(`Player ${player.Name} already has an active mercenary.`);
			return;
		}

		const config: RunConfig = {
			seed: seed ?? 0,
			mode: "ArenaClear",
			missionMode: "Standard",
			difficulty: 1,
		};

		this.fsm = new RunStateMachine(config);

		if (this.fsm.transition(MatchPhase.Generating)) {
			Log.info(`Match starting! Seed: ${seed ?? 0}`);
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
		} else {
			Log.warn("Cannot start run from current state");
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
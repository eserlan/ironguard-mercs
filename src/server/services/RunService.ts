import { Service, OnStart, OnInit } from "@flamework/core";
import { GlobalEvents } from "../../shared/net";
import { RunStateMachine } from "../../shared/algorithms/run-state";
import { MatchPhase } from "../../shared/domain/types";
import { Log } from "../../shared/utils/log";

@Service({})
export class RunService implements OnStart, OnInit {
	private fsm = new RunStateMachine();

	onInit() {}

	onStart() {
		Log.info("RunService started");
		
		GlobalEvents.server.RequestStartRun.connect((player, seed) => {
			this.requestStart(player, seed);
		});
	}

	private requestStart(player: Player, seed?: number) {
		if (this.fsm.transition(MatchPhase.Generating)) {
			Log.info(`Match starting! Seed: ${seed ?? 0}`);
			this.broadcastState();
			
			// Mock loop for Vertical Slice MVP phase 3
			// In real impl, these transitions happen via other services signals
			task.delay(1, () => {
				this.fsm.transition(MatchPhase.Spawning);
				// Real impl: this.loadoutService.applyKits();
				this.broadcastState();
				task.delay(1, () => {
					this.fsm.transition(MatchPhase.Playing);
					this.broadcastState();
				});
			});

		} else {
			Log.warn("Cannot start run from current state", this.fsm.getState().phase);
		}
	}

	public isSafeRoom(): boolean {
		// Mock logic
		return this.fsm.getPhase() === MatchPhase.Lobby;
	}

	private broadcastState() {
		GlobalEvents.server.RunStateChanged.broadcast(this.fsm.getState());
	}
}

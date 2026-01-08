import { MatchPhase, MatchState, RunConfig } from "../domain/run";
import { getTime } from "../utils/time";

export class RunStateMachine {
	private state: MatchState;

	constructor(config: RunConfig) {
		this.state = {
			phase: MatchPhase.Lobby,
			config: config,
			startTime: 0,
			elapsed: 0,
			result: "None",
			wave: 0,
			enemiesAlive: 0,
		};
	}

	public getState(): MatchState {
		return { ...this.state };
	}

	public setWorldPlan(plan: import("../domain/world").WorldPlan) {
		this.state.worldPlan = plan;
	}

	public transition(to: MatchPhase): boolean {
		const from = this.state.phase;
		if (this.canTransition(from, to)) {
			this.state.phase = to;
			
			if (to === MatchPhase.Playing && this.state.startTime === 0) {
				this.state.startTime = getTime();
			}
			
			return true;
		}
		return false;
	}

	private canTransition(from: MatchPhase, to: MatchPhase): boolean {
		// Valid transitions graph
		switch (from) {
			case MatchPhase.Lobby:
				return to === MatchPhase.Generating;
			case MatchPhase.Generating:
				return to === MatchPhase.Spawning;
			case MatchPhase.Spawning:
				return to === MatchPhase.Playing;
			case MatchPhase.Playing:
				return to === MatchPhase.Ending;
			case MatchPhase.Ending:
				return to === MatchPhase.Results;
			case MatchPhase.Results:
				return to === MatchPhase.Lobby;
			default:
				return false;
		}
	}
}

import { MatchPhase, MatchState } from "../domain/types";

export class RunStateMachine {
	private state: MatchState;

	constructor() {
		this.state = {
			phase: MatchPhase.Lobby,
			wave: 0,
			enemiesAlive: 0,
		};
	}

	public getState(): MatchState {
		return { ...this.state };
	}

	public transition(to: MatchPhase): boolean {
		const from = this.state.phase;
		if (this.canTransition(from, to)) {
			this.state.phase = to;
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

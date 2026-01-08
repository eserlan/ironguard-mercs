import { AIPhase } from "../../domain/enemies/enemy-types";

export class EnemyAIStateMachine {
	private currentPhase: AIPhase = AIPhase.Idle;

	public getPhase(): AIPhase {
		return this.currentPhase;
	}

	public transition(to: AIPhase): boolean {
		const from = this.currentPhase;
		if (this.canTransition(from, to)) {
			this.currentPhase = to;
			return true;
		}
		return false;
	}

	private canTransition(from: AIPhase, to: AIPhase): boolean {
		if (from === to) return false;

		switch (from) {
			case AIPhase.Idle:
				return to === AIPhase.Engage;
			case AIPhase.Engage:
				return to === AIPhase.Pressure || to === AIPhase.Idle;
			case AIPhase.Pressure:
				return to === AIPhase.Recover || to === AIPhase.Reposition;
			case AIPhase.Recover:
				return to === AIPhase.Engage || to === AIPhase.Reposition || to === AIPhase.Idle;
			case AIPhase.Reposition:
				return to === AIPhase.Engage || to === AIPhase.Pressure;
			default:
				return false;
		}
	}
}

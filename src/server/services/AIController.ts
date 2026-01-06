import { Service, OnStart } from "@flamework/core";
import { EnemyAIStateMachine } from "../../shared/algorithms/enemies/ai-state";
import { AIPhase } from "../../shared/domain/enemies/types";

@Service({})
export class AIController implements OnStart {
	onStart() {}

	public update(dt: number) {
		// Mock: Drive FSMs for all NPCs
	}
}

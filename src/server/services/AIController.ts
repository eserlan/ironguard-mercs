import { Service, OnStart } from "@flamework/core";

@Service({})
export class AIController implements OnStart {
	onStart() {}

	public update(_dt: number) {
		// Mock: Drive FSMs for all NPCs
	}
}

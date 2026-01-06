import { Service } from "@flamework/core";

@Service({})
export class LOSService {
	public checkLOS(origin: Vector3, target: Vector3): boolean {
		// Real impl: Workspace:Raycast
		return true;
	}
}

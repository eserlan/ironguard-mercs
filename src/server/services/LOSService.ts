import { Service } from "@flamework/core";

@Service({})
export class LOSService {
	public checkLOS(_origin: Vector3, _target: Vector3): boolean {
		// Real impl: Workspace:Raycast
		return true;
	}
}

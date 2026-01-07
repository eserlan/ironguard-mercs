import { Service } from "@flamework/core";

@Service({})
export class HitDetectionService {
	// Real impl: Workspace:Raycast(...)
	public raycast(_origin: Vector3, _dir: Vector3) {
        return undefined; 
    }
}

import { Service } from "@flamework/core";

@Service({})
export class HitDetectionService {
	public raycast(_origin: Vector3, _dir: Vector3) {        // Real impl: Workspace:Raycast(...)
        return undefined; 
    }
}

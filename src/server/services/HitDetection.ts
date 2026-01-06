import { Service } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class HitDetectionService {
    public raycast(origin: Vector3, dir: Vector3) {
        // Real impl: Workspace:Raycast(...)
        return undefined; 
    }
}

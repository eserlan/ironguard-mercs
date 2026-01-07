import { Service } from "@flamework/core";
import { WorldPlan } from "../../shared/domain/world";
import { Log } from "../../shared/utils/log";

@Service({})
export class WorldSpawner {
    public spawn(_plan: WorldPlan) {
        Log.info("Spawning world based on plan...");
        
        // Mock Implementation for Vertical Slice Phase 4
        // Real impl would:
        // 1. Clear Workspace.Arena
        // 2. Loop plan.layout
        // 3. Clone ReplicatedStorage.Assets[id]
        // 4. Set CFrame = Vector3(p.x, p.y, p.z) * Angles(0, rot, 0)
    }
    
    public cleanup() {
        Log.info("Cleaning world...");
    }
}

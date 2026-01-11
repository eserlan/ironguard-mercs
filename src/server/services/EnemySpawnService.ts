import { Service, OnStart } from "@flamework/core";
import { createWavePlan } from "../../shared/algorithms/wave-plan";
import { Log } from "../../shared/utils/log";
import { EnemyVisualService } from "./EnemyVisualService";
import { EnemyRegistry } from "shared/domain/enemies/config";
import { ServerStorage, Workspace } from "@rbxts/services";

@Service({})
export class EnemySpawnService implements OnStart {
    constructor(private visualService: EnemyVisualService) { }

    onStart() { }

    public startWaves(seed: number, difficulty: number) {
        const plan = createWavePlan(seed, difficulty);
        Log.info("Starting waves...", plan);
    }

    public spawnEnemy(enemyId: string, cframe: CFrame) {
        const archetype = EnemyRegistry.get(enemyId);
        if (!archetype) {
            Log.warn(`Unknown enemy: ${enemyId}`);
            return;
        }

        const enemyRigs = ServerStorage.FindFirstChild("EnemyRigs");
        if (!enemyRigs) {
            Log.error("ServerStorage/EnemyRigs folder missing");
            return;
        }

        const baseRig = enemyRigs.FindFirstChild("EnemyBaseR15") as Model;
        if (!baseRig) {
             Log.error("ServerStorage/EnemyRigs/EnemyBaseR15 model missing");
             return;
        }

        const rig = baseRig.Clone();
        rig.Name = archetype.name;
        
        // Ensure PrimaryPart exists for CFrame usage
        if (rig.PrimaryPart) {
            rig.SetPrimaryPartCFrame(cframe);
        } else {
            rig.PivotTo(cframe);
        }
        
        rig.Parent = Workspace;

        // Apply Visuals
        this.visualService.setupEnemyVisuals(rig, archetype);

        Log.info(`Spawned enemy ${enemyId} at ${cframe}`);
        return rig;
    }
}

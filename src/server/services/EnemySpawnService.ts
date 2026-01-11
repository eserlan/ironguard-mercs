import { Service, OnStart } from "@flamework/core";
import { createWavePlan } from "../../shared/algorithms/wave-plan";
import { Log } from "../../shared/utils/log";
import { EnemyVisualService } from "./EnemyVisualService";
import { EnemyRegistry } from "shared/domain/enemies/config";

@Service({})
export class EnemySpawnService implements OnStart {
    constructor(private visualService: EnemyVisualService) { }

    onStart() { }

    public startWaves(seed: number, difficulty: number) {
        const plan = createWavePlan(seed, difficulty);
        Log.info("Starting waves...", plan);

        // Example integration: setup a placeholder rig
        // In real impl, we'd iterate the wave plan and spawn models
        // const rig = spawnRig();
        // const archetype = EnemyRegistry.get(plan.waves[0].enemyId);
        // if (archetype) this.visualService.setupEnemyVisuals(rig, archetype);
    }
}

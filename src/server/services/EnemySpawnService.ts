import { Service, OnStart } from "@flamework/core";
import { createWavePlan } from "../../shared/algorithms/wave-plan";
import { Log } from "../../shared/utils/log";

@Service({})
export class EnemySpawnService implements OnStart {
    onStart() {}

    public startWaves(seed: number, difficulty: number) {
        const plan = createWavePlan(seed, difficulty);
        Log.info("Starting waves...", plan);
        // Real impl: Loop waves, spawn models from ServerStorage, wait for Death events
    }
}

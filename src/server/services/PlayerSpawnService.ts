import { Service, OnStart } from "@flamework/core";
import { WorldPlan } from "../../shared/domain/world";
import { Log } from "../../shared/utils/log";

@Service({})
export class PlayerSpawnService implements OnStart {
    onStart() {}

    	public spawn(_plan: WorldPlan, _players: Player[]) {        Log.info(`Spawning players...`);
        // Real impl: Loop players, Character:MoveTo(plan.playerSpawns[i])
    }
}

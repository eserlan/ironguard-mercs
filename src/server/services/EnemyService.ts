import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class EnemyService implements OnStart {
	onStart() {
		Log.info("EnemyService started");
	}

	public spawnEnemy(archetypeId: string, position: Vector3) {
		Log.info(`Spawning ${archetypeId} at ${position}`);
	}
}
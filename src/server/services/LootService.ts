import { Service } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class LootService {
	public spawnChest(position: Vector3) {
		Log.info(`Spawning loot chest at ${position}`);
	}
}

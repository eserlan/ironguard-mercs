import { Log } from "../../shared/utils/log";

@Service({})
export class ProjectileService {
	public spawnProjectile(config: unknown, origin: CFrame, sourceId: string) {
		Log.info(`Spawning projectile from ${sourceId} at ${origin}`);
	}
}

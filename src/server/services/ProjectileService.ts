import { Service } from "@flamework/core";

@Service({})
export class ProjectileService {
	public spawnProjectile(_config: unknown) {
		// Real impl: Create BasePart, use LinearVelocity or manual CFrame updates
	}
}

import { Service } from "@flamework/core";
import { Components } from "@flamework/components";
import { EffectBlock, EffectType } from "../../shared/domain/abilities/types";
import { StandardEffects } from "../components/abilities/StandardEffects";
import { CombatService } from "./CombatService";
import { ProjectileService } from "./ProjectileService";

@Service({})
export class EffectService {
	constructor(
		private combatService: CombatService,
		private components: Components,
		private projectileService: ProjectileService
	) { }

	public resolveEffect(target: Instance, block: EffectBlock, sourceId: string) {
		const rng = this.combatService.getRng();
		if (!rng) return;

		switch (block.type) {
			case EffectType.Damage:
				StandardEffects.applyDamage(target, block, sourceId, this.combatService, this.components, rng);
				break;
			case EffectType.Heal:
				StandardEffects.applyHeal(target, block, this.components);
				break;
			case EffectType.Status:
				// StandardEffects.applyStatus...
				break;
			case EffectType.Projectile:
				this.projectileService.spawnProjectile(block.value, (target as Model).GetPivot(), sourceId);
				break;
			case EffectType.Dash:
			case EffectType.Shield:
				warn(`EffectService.resolveEffect: Effect type '${block.type}' is not implemented for source '${sourceId}'.`);
				break;
			default:
				warn(`EffectService.resolveEffect: Unsupported effect type '${tostring(block.type)}' for source '${sourceId}'.`);
				break;
		}
	}
}

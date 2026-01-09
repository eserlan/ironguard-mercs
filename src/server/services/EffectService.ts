import { Service } from "@flamework/core";
import { Components } from "@flamework/components";
import { EffectBlock, EffectType } from "../../shared/domain/abilities/types";
import { StandardEffects } from "../components/abilities/StandardEffects";
import { CombatService } from "./CombatService";
import { ProjectileService } from "./ProjectileService";
import { TargetingBiasService } from "./TargetingBiasService";
import { Log } from "../../shared/utils/log";

@Service({})
export class EffectService {
	constructor(
		private combatService: CombatService,
		private components: Components,
		private projectileService: ProjectileService,
		private biasService: TargetingBiasService,
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
				this.resolveStatusEffect(target, block, sourceId);
				break;
			case EffectType.Projectile:
				this.projectileService.spawnProjectile(block.value, (target as Model).GetPivot(), sourceId);
				break;
			case EffectType.Shield:
				StandardEffects.applyShield(target, block, this.components);
				break;
			case EffectType.StatMod:
				this.resolveStatMod(target, block, sourceId);
				break;
			case EffectType.MitigationMod:
				this.resolveMitigationMod(target, block, sourceId);
				break;
			case EffectType.Dash:
				StandardEffects.applyDash(target, block);
				break;
			case EffectType.Augment:
				this.resolveAugment(target, block, sourceId);
				break;
			default:
				warn(`EffectService.resolveEffect: Unsupported effect type '${tostring(block.type)}' for source '${sourceId}'.`);
				break;
		}
	}

	private resolveAugment(target: Instance, block: EffectBlock, sourceId: string) {
		const augmentId = block.params?.augmentId as string;
		Log.info(`Applied Augment ${augmentId} (value: ${block.value}) to ${target.Name}`);
	}

	private resolveMitigationMod(target: Instance, block: EffectBlock, sourceId: string) {
		const duration = block.params?.duration as number;
		Log.info(`Applied MitigationMod ${block.value}% to ${target.Name} for ${duration}s`);
	}

	private resolveStatMod(target: Instance, block: EffectBlock, sourceId: string) {
		// Real impl: register mod with StatService
		const statId = block.params?.statId as string;
		const duration = block.params?.duration as number;
		Log.info(`Applied StatMod ${statId} (x${block.value}) to ${target.Name} for ${duration}s`);
	}

	private resolveStatusEffect(target: Instance, block: EffectBlock, sourceId: string) {
		const effectId = block.params?.statusEffectId as string;
		const duration = block.value ?? 0;

		if (effectId === "marked") {
			this.biasService.addBias(sourceId, 50, duration);
		} else if (effectId === "marked_strong") {
			this.biasService.addBias(sourceId, 150, duration);
		} else if (effectId === "cleanse") {
			// Real impl: remove debuffs from target
		}
	}
}

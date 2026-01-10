import { Service } from "@flamework/core";
import { Components } from "@flamework/components";
import { EffectBlock, EffectType } from "../../shared/domain/abilities/types";
import { StandardEffects } from "../components/abilities/StandardEffects";
import { CombatService } from "./CombatService";
import { ProjectileService } from "./ProjectileService";
import { TargetingBiasService } from "./TargetingBiasService";
import { Log } from "../../shared/utils/log";
import { getStatusEffect } from "../../shared/domain/combat/status-effects-config";

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

		const isAoE = block.params?.radius !== undefined;
		const consumeScorch = block.params?.consumeScorch as boolean;

		switch (block.type) {
			case EffectType.Damage:
				// Create a local copy of the block for Scorch consumption to avoid mutating the original
				let damageBlock = block;
				if (consumeScorch) {
					// Real impl: check if target has Scorch attribute/status
					// For now, simulate bonus
					const hasScorch = target.GetAttribute("HasScorch") === true;
					if (hasScorch) {
						Log.info(`Consuming Scorch on ${target.Name} for bonus damage!`);
						const adjustedDamage = (block.value ?? 0) * 2;
						damageBlock = { ...block, value: adjustedDamage };
						target.SetAttribute("HasScorch", false);
					}
				}

				if (isAoE) {
					const origin = typeIs(target, "Vector3") ? target : (target as Model).GetPivot().Position;
					StandardEffects.applyAoEDamage(origin, damageBlock, sourceId, this.combatService, this.components, rng);
				} else {
					StandardEffects.applyDamage(target, damageBlock, sourceId, this.combatService, this.components, rng);
				}
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

	private resolveAugment(_target: Instance, block: EffectBlock, _sourceId: string) {
		// TODO: Implement augment system
		const augmentId = block.params?.augmentId as string;
		Log.info(`Applied Augment ${augmentId} (value: ${block.value}) to ${_target.Name}`);
	}

	private resolveMitigationMod(_target: Instance, block: EffectBlock, _sourceId: string) {
		// TODO: Implement mitigation modifier system
		const duration = block.params?.duration as number;
		Log.info(`Applied MitigationMod ${block.value}% to ${_target.Name} for ${duration}s`);
	}

	private resolveStatMod(_target: Instance, block: EffectBlock, _sourceId: string) {
		// TODO: Register mod with StatService when implemented
		const statId = block.params?.statId as string;
		const duration = block.params?.duration as number;
		Log.info(`Applied StatMod ${statId} (x${block.value}) to ${_target.Name} for ${duration}s`);
	}

	private resolveStatusEffect(target: Instance, block: EffectBlock, sourceId: string) {
		const effectId = block.params?.statusEffectId as string;
		const duration = block.value ?? 0;

		const effectDef = getStatusEffect(effectId);
		if (!effectDef) {
			warn(`Unknown status effect: ${effectId}`);
			return;
		}

		if (effectDef.biasMod !== undefined) {
			this.biasService.addBias(sourceId, effectDef.biasMod, duration);
		} else if (effectDef.isCleanse) {
			// Real impl: remove debuffs from target
			Log.info(`Cleansing debuffs from ${target.Name}`);
		} else {
			// Handle other status types via a handler registry
			const statusEffectHandlers: Record<
				string,
				(params: {
					target: Instance;
					sourceId: string;
					duration: number;
					effectDef: typeof effectDef;
				}) => void
			> = {
				scorch: ({ target: scorchTarget, duration: scorchDuration, effectDef: scorchDef }) => {
					Log.info(
						`Applying Scorch to ${scorchTarget.Name} for ${scorchDuration}s. (DoT: ${scorchDef.damagePerTick})`,
					);
					scorchTarget.SetAttribute("HasScorch", true);
					// TODO: Register with a StatusManager that handles ticks
				},
				untargetable: ({ sourceId: untargetableSourceId, duration: untargetableDuration, target: untargetableTarget }) => {
					this.biasService.setUntargetable(untargetableSourceId, untargetableDuration);
					Log.info(
						`Applying Untargetable to ${untargetableTarget.Name} for ${untargetableDuration}s.`,
					);
				},
				slow: ({ target: slowTarget, duration: slowDuration, effectDef: slowDef }) => {
					Log.info(
						`Applying Slow to ${slowTarget.Name} for ${slowDuration}s. (Speed: ${slowDef.speedMod}x)`,
					);
				},
				highlighted: ({ target: highlightedTarget, duration: highlightedDuration }) => {
					Log.info(`Highlighting ${highlightedTarget.Name} for ${highlightedDuration}s.`);
				},
				tether: ({ target: tetherTarget, duration: tetherDuration }) => {
					Log.info(`Tethering ${tetherTarget.Name} for ${tetherDuration}s.`);
				},
			};

			const handler = statusEffectHandlers[effectId];
			if (handler) {
				handler({ target, sourceId, duration, effectDef });
			} else {
				warn(`No handler found for status effect: ${effectId}`);
			}
		}
	}
}

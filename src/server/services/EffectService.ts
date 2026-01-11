import { Service } from "@flamework/core";
import { Components } from "@flamework/components";
import { Players } from "@rbxts/services";
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
			case EffectType.Damage: {
				let damageValue = block.value ?? 0;
				if (consumeScorch) {
					const hasScorch = target.GetAttribute("HasScorch") === true;
					if (hasScorch) {
						Log.info(`Consuming Scorch on ${target.Name} for bonus damage!`);
						damageValue *= 2;
						target.SetAttribute("HasScorch", false);
						// TODO: Also remove the actual status effect if we have a status effect system
					}
				}

				if (isAoE) {
					const origin = typeIs(target, "Vector3") ? target : (target as Model).GetPivot().Position;
					StandardEffects.applyAoEDamage(origin, { ...block, value: damageValue }, sourceId, this.combatService, this.components, rng);
				} else {
					StandardEffects.applyDamage(target, { ...block, value: damageValue }, sourceId, this.combatService, this.components, rng);
				}
				break;
			}
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
			case EffectType.DamageMod:
				this.resolveDamageMod(target, block, sourceId);
				break;




			case EffectType.MitigationMod:
				this.resolveMitigationMod(target, block, sourceId);
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

	private resolveStatMod(target: Instance, block: EffectBlock, sourceId: string) {
		const statId = block.params?.statId as string;
		const duration = block.params?.duration as number;
		const condition = block.params?.condition as string;

		if (condition === "target_scorched") {
			const hasScorch = target.GetAttribute("HasScorch") === true;
			if (hasScorch) {
				const sourcePlayer = Players.GetPlayerByUserId(tonumber(sourceId) ?? 0);
				const sourceChar = sourcePlayer?.Character;
				if (sourceChar) {
					Log.info(`Target is scorched! Applying conditional ${statId} mod to ${sourcePlayer?.Name}`);
					sourceChar.SetAttribute(`StatMod_${statId}`, block.value);
					task.delay(duration, () => {
						if (sourceChar.Parent) {
							sourceChar.SetAttribute(`StatMod_${statId}`, undefined);
						}
					});
				}
			}
			return;
		}

		Log.info(`Applied StatMod ${statId} (x${block.value}) to ${target.Name} for ${duration}s (Source: ${sourceId})`);
		// Implementation would involve a StatService
		target.SetAttribute(`StatMod_${statId}`, block.value);
		task.delay(duration, () => {
			if (target.Parent) {
				target.SetAttribute(`StatMod_${statId}`, undefined);
			}
		});
	}

	private resolveDamageMod(target: Instance, block: EffectBlock, sourceId: string) {
		const duration = block.params?.duration as number;
		Log.info(`Applied DamageMod x${block.value} to ${target.Name} for ${duration}s (Source: ${sourceId})`);
		target.SetAttribute("DamageTakenMultiplier", block.value);
		task.delay(duration, () => {
			if (target.Parent) {
				target.SetAttribute("DamageTakenMultiplier", undefined);
			}
		});
	}

	private resolveStatusEffect(target: Instance, block: EffectBlock, _sourceId: string) {
		const effectId = block.params?.statusEffectId as string;
		const duration = block.value ?? 0;

		const effectDef = getStatusEffect(effectId);
		if (!effectDef) {
			warn(`Unknown status effect: ${effectId}`);
			return;
		}

		Log.info(`Applied Status Effect ${effectDef.name} to ${target.Name} for ${duration}s`);

		if (effectId === "scorch") {
			target.SetAttribute("HasScorch", true);
			task.delay(duration, () => {
				if (target.Parent) {
					target.SetAttribute("HasScorch", false);
				}
			});
		} else if (effectId === "untargetable") {
			target.SetAttribute("Untargetable", true);
			task.delay(duration, () => {
				if (target.Parent) {
					target.SetAttribute("Untargetable", false);
				}
			});
		}

		// Visual effect placeholder
		if (effectDef.isVisual) {
			Log.info(`Showing visual for ${effectDef.name} on ${target.Name}`);
		}
	}
}

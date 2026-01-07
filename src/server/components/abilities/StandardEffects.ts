import { EffectBlock } from "../../../shared/domain/abilities/types";
import { HealthComponent } from "../../cmpts/HealthComponent";
import { CombatService } from "../../services/CombatService";
import { Components } from "@flamework/components";
import { resolveDamage } from "../../../shared/algorithms/combat/damage";
import { CombatRNG } from "../../../shared/algorithms/combat/rng";

// Pure-ish functions, but they interact with game state via injected dependencies
export const StandardEffects = {
	applyDamage(
		target: Instance,
		block: EffectBlock,
		sourceId: string,
		combatService: CombatService,
		components: Components,
		rng: CombatRNG,
	) {
		const health = components.getComponent<HealthComponent>(target);
		if (!health) return;

		// In a real app, we'd fetch attacker stats here. For now using defaults/placeholders.
		const result = resolveDamage(
			sourceId,
			target.Name,
			{
				id: "ability",
				type: "Magic",
				damage: block.value,
				cooldown: 0,
				range: 100,
			} as any, // Mock weapon config from block
			{
				baseDamage: 0,
				synergyMultiplier: 0,
				critChance: 0.05,
				critMultiplier: 1.5,
			},
			false,
			0,
			rng,
			(target.GetAttribute("Health") as number) ?? 100,
		);

		if (result.amount > 0) {
			combatService.applyDamage(target, result.amount, result.isCrit, result.isFatal, sourceId, "ability");
		}
	},

	applyHeal(target: Instance, block: EffectBlock, components: Components) {
		const health = components.getComponent<HealthComponent>(target);
		if (!health) return;

		health.heal(block.value ?? 0);
	},
};

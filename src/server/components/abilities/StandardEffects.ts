import { EffectBlock } from "../../../shared/domain/abilities/types";
import { HealthComponent } from "../../cmpts/HealthComponent";
import { CombatService } from "../../services/CombatService";
import { Components } from "@flamework/components";
import { Players } from "@rbxts/services";
import { resolveDamage } from "../../../shared/algorithms/combat/damage";
import { calculateAoEMultiplier } from "../../../shared/algorithms/combat/aoe";
import { CombatRNG } from "../../../shared/algorithms/combat/rng";
import { calculateDashCFrame } from "../../../shared/algorithms/movement";
import { Log } from "../../../shared/utils/log";

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

		const healOnKill = block.params?.healOnKill as number | undefined;

		const result = resolveDamage(
			sourceId,
			target.Name,
			{
				id: "ability",
				type: "Magic",
				damage: block.value ?? 0,
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
			target.GetAttribute("IsBlocking") === true,
		);

		if (result.amount > 0) {
			combatService.applyDamage(target, result.amount, result.isCrit, result.isFatal, sourceId, "ability");

			if (result.isFatal && healOnKill) {
				const sourcePlayer = Players.GetPlayerByUserId(tonumber(sourceId) ?? 0);
				const sourceChar = sourcePlayer?.Character;
				if (sourceChar) {
					const sourceHealth = components.getComponent<HealthComponent>(sourceChar);
					if (sourceHealth) {
						Log.info(`Heal on kill triggered for ${sourcePlayer?.Name}: +${healOnKill}`);
						sourceHealth.heal(healOnKill);
					}
				}
			}
		}
	},

	applyHeal(target: Instance, block: EffectBlock, components: Components) {
		const health = components.getComponent<HealthComponent>(target);
		if (!health) return;

		health.heal(block.value ?? 0);
	},

	applyShield(target: Instance, block: EffectBlock, components: Components) {
		const health = components.getComponent<HealthComponent>(target);
		if (!health) return;

		health.addShield(block.value ?? 0);
	},

	applyDash(target: Instance, block: EffectBlock) {
		if (!target.IsA("Model")) return;
		const root = target.FindFirstChild("HumanoidRootPart") as BasePart;
		if (!root) return;

		const distance = block.value ?? 0;
		// Use pure calculation from shared/algorithms
		root.CFrame = calculateDashCFrame(root.CFrame, distance);
	},

	applyAoEDamage(
		origin: Vector3,
		block: EffectBlock,
		sourceId: string,
		combatService: CombatService,
		components: Components,
		rng: CombatRNG,
	) {
		const radius = (block.params?.radius as number) ?? 10;
		const hasFalloff = (block.params?.falloff as boolean) ?? false;

		// Use spatial query
		const overlapParams = new OverlapParams();
		overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

		const parts = game.Workspace.GetPartBoundsInRadius(origin, radius, overlapParams);
		const hitCharacters = new Set<Model>();

		for (const part of parts) {
			const character = part.Parent;
			if (character && character.IsA("Model") && character.FindFirstChild("Humanoid")) {
				hitCharacters.add(character);
			}
		}

		hitCharacters.forEach((character) => {
			const health = components.getComponent<HealthComponent>(character);
			if (!health) return;

			const distance = character.GetPivot().Position.sub(origin).Magnitude;
			const multiplier = calculateAoEMultiplier(distance, radius, hasFalloff);

			if (multiplier <= 0) return;

			const finalDamage = (block.value ?? 0) * multiplier;

			const result = resolveDamage(
				sourceId,
				character.Name,
				{
					id: "ability_aoe",
					type: "Magic",
					damage: finalDamage,
					cooldown: 0,
					range: 100,
				} as any,
				{
					baseDamage: 0,
					synergyMultiplier: 0,
					critChance: 0.05,
					critMultiplier: 1.5,
				},
				false,
				0,
				rng,
				(character.GetAttribute("Health") as number) ?? 100,
				character.GetAttribute("IsBlocking") === true,
			);

			if (result.amount > 0) {
				combatService.applyDamage(character, result.amount, result.isCrit, result.isFatal, sourceId, "ability");
			}
		});
	},
};
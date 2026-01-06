import { AbilityConfig, AbilityCategory, ActivationType, TargetingType } from "../../domain/abilities/types";

export const DASH: AbilityConfig = {
	id: "dash",
	name: "Dash",
	category: AbilityCategory.Mobility,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	cooldown: 3,
	range: 15,
	effectBlocks: [{ type: "Dash", params: { distance: 15, speed: 50 } }],
};

export const FIREBALL: AbilityConfig = {
	id: "fireball",
	name: "Fireball",
	category: AbilityCategory.Offense,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Direction,
	cooldown: 5,
	range: 50,
	effectBlocks: [{ type: "SpawnProjectile", params: { speed: 100, damage: 50 } }],
};

export const SHIELD: AbilityConfig = {
	id: "shield",
	name: "Shield",
	category: AbilityCategory.Defense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	cooldown: 10,
	range: 0,
	effectBlocks: [{ type: "ApplyStatus", params: { statusId: "shield", duration: 5, amount: 100 } }],
};

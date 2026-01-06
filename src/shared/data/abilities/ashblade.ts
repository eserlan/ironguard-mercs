import { AbilityConfig, AbilityCategory, ActivationType, TargetingType } from "../../domain/abilities/types";

export const LUNGE: AbilityConfig = {
	id: "lunge",
	name: "Lunge Strike",
	category: AbilityCategory.Mobility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Direction,
	range: 20,
	variants: {
		top: { cooldown: 8, effectBlocks: [{ type: "Dash", params: { distance: 20 } }, { type: "Damage", params: { amount: 100 } }] },
		bottom: { cooldown: 3, effectBlocks: [{ type: "Dash", params: { distance: 10 } }] },
	},
};

export const EXECUTE: AbilityConfig = {
	id: "execute",
	name: "Execute",
	category: AbilityCategory.Offense,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Entity,
	range: 5,
	variants: {
		top: { cooldown: 20, effectBlocks: [{ type: "Damage", params: { amount: 300 } }] },
		bottom: { cooldown: 10, effectBlocks: [{ type: "Damage", params: { amount: 50 } }, { type: "ApplyStatus", params: { statusId: "vulnerable", duration: 2 } }] },
	},
};

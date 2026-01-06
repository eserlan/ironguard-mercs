import { AbilityConfig, AbilityCategory, ActivationType, TargetingType } from "../../domain/abilities/types";

export const SHIELD_WALL: AbilityConfig = {
	id: "shield-wall",
	name: "Shield Wall",
	category: AbilityCategory.Defense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 0,
	variants: {
		top: { cooldown: 15, effectBlocks: [{ type: "Shield", params: { amount: 200, duration: 5 } }] },
		bottom: { cooldown: 5, effectBlocks: [{ type: "DamageReduction", params: { percent: 0.2, duration: 3 } }] },
	},
};

export const RESCUE_LEAP: AbilityConfig = {
	id: "rescue-leap",
	name: "Rescue Leap",
	category: AbilityCategory.Mobility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Entity,
	range: 30,
	variants: {
		top: { cooldown: 12, effectBlocks: [{ type: "Dash", params: { distance: 30 } }, { type: "Shield", params: { amount: 50 } }] },
		bottom: { cooldown: 6, effectBlocks: [{ type: "Dash", params: { distance: 15 } }] },
	},
};

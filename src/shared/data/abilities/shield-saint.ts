import { AbilityConfig, AbilityCategory, ActivationType, TargetingType, EffectType } from "../../domain/abilities/types";

export const SHIELD_WALL: AbilityConfig = {
	id: "shield-wall",
	name: "Shield Wall",
	category: AbilityCategory.Defense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 0,
	variants: {
		top: {
			cooldown: 15,
			effectBlocks: [
				{ type: EffectType.Shield, value: 200 }
			]
		},
		bottom: {
			cooldown: 5,
			effectBlocks: [
				{ type: EffectType.Status, value: 3 } // Damage Reduction duration
			]
		},
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
		top: {
			cooldown: 12,
			effectBlocks: [
				{ type: EffectType.Dash, value: 30 },
				{ type: EffectType.Shield, value: 50 }
			]
		},
		bottom: {
			cooldown: 6,
			effectBlocks: [
				{ type: EffectType.Dash, value: 15 }
			]
		},
	},
};

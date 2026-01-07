import { AbilityConfig, AbilityCategory, ActivationType, TargetingType, EffectType } from "../../domain/abilities/types";

export const LUNGE: AbilityConfig = {
	id: "lunge",
	name: "Lunge Strike",
	category: AbilityCategory.Mobility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Direction,
	range: 20,
	variants: {
		top: {
			cooldown: 8,
			effectBlocks: [
				{ type: EffectType.Dash, value: 20 },
				{ type: EffectType.Damage, value: 100 }
			]
		},
		bottom: {
			cooldown: 3,
			effectBlocks: [
				{ type: EffectType.Dash, value: 10 }
			]
		},
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
		top: {
			cooldown: 20,
			effectBlocks: [
				{ type: EffectType.Damage, value: 300 }
			]
		},
		bottom: {
			cooldown: 10,
			effectBlocks: [
				{ type: EffectType.Damage, value: 50 },
				{ type: EffectType.Status, value: 2 } // Vulnerable duration
			]
		},
	},
};

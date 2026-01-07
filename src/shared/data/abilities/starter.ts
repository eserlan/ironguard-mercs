import { AbilityConfig, AbilityCategory, ActivationType, TargetingType, EffectType } from "../../domain/abilities/types";

export const DASH: AbilityConfig = {
	id: "dash",
	name: "Dash",
	category: AbilityCategory.Mobility,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 15,
	variants: {
		top: {
			cooldown: 3,
			effectBlocks: [{ type: EffectType.Dash, value: 50 }] // Placeholder for Dash logic
		},
		bottom: {
			cooldown: 3,
			effectBlocks: [{ type: EffectType.Dash, value: 50 }]
		}
	}
};

export const FIREBALL: AbilityConfig = {
	id: "fireball",
	name: "Fireball",
	category: AbilityCategory.Offense,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Direction,
	range: 50,
	variants: {
		top: {
			cooldown: 5,
			effectBlocks: [{ type: EffectType.Damage, value: 50 }]
		},
		bottom: {
			cooldown: 5,
			effectBlocks: [{ type: EffectType.Damage, value: 50 }]
		}
	}
};

export const SHIELD: AbilityConfig = {
	id: "shield",
	name: "Shield",
	category: AbilityCategory.Defense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 0,
	variants: {
		top: {
			cooldown: 10,
			effectBlocks: [{ type: EffectType.Shield, value: 100 }] // Shield amount
		},
		bottom: {
			cooldown: 10,
			effectBlocks: [{ type: EffectType.Shield, value: 100 }]
		}
	}
};

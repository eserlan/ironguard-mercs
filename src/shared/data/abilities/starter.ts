import { AbilityConfig, AbilityCategory, ActivationType, TargetingType, EffectType } from "../../domain/abilities/types";

export const DASH: AbilityConfig = {
	id: "dash",
	name: "Dash",
	description: "A quick burst of speed to reposition.",
	category: AbilityCategory.Mobility,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 15,
	variants: {
		top: {
			name: "Sprint Dash",
			description: "Push yourself forward.",
			technical: "Dash 50 studs forward.",
			cooldown: 3,
			effectBlocks: [{ type: EffectType.Dash, value: 50 }]
		},
		bottom: {
			name: "Quick Dash",
			description: "A shorter, more frequent hop.",
			technical: "Dash 5 studs forward.",
			cooldown: 3,
			effectBlocks: [{ type: EffectType.Dash, value: 50 }]
		}
	}
};

export const FIREBALL: AbilityConfig = {
	id: "fireball",
	name: "Fireball",
	description: "Classic arcane destruction.",
	category: AbilityCategory.Offense,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Direction,
	range: 50,
	variants: {
		top: {
			name: "Explosive Fireball",
			description: "A large blast of flame.",
			technical: "Deals 50 Damage in a small radius.",
			cooldown: 5,
			effectBlocks: [{ type: EffectType.Damage, value: 50 }]
		},
		bottom: {
			name: "Cinder Bolt",
			description: "A faster, smaller bolt.",
			technical: "Deals 50 Damage to a single target.",
			cooldown: 5,
			effectBlocks: [{ type: EffectType.Damage, value: 50 }]
		}
	}
};

export const SHIELD: AbilityConfig = {
	id: "shield",
	name: "Shield",
	description: "Manifest a barrier of pure energy.",
	category: AbilityCategory.Defense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 0,
	variants: {
		top: {
			name: "Over-Shield",
			description: "A heavy, temporary barrier.",
			technical: "Gain a 100 HP Shield.",
			cooldown: 10,
			effectBlocks: [{ type: EffectType.Shield, value: 100 }]
		},
		bottom: {
			name: "Reflex Shield",
			description: "A fast-casting guard.",
			technical: "Gain a 100 HP Shield.",
			cooldown: 10,
			effectBlocks: [{ type: EffectType.Shield, value: 100 }]
		}
	}
};

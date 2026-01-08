import { AbilityConfig, AbilityCategory, ActivationType, TargetingType, EffectType } from "../../domain/abilities/types";

export const OATH_SHIELD: AbilityConfig = {
	id: "oath-shield",
	name: "Oath Shield",
	description: "The primary tool of a Saint—the vow to stand before others.",
	category: AbilityCategory.Defense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 0,
	variants: {
		top: {
			name: "Bulwark Stance",
			description: "Raise your shield and stand your ground.",
			technical: "Take 30% reduced damage for 3s. Enemies hit are Marked for 5s.",
			cooldown: 15,
			effectBlocks: [
				{ type: EffectType.MitigationMod, value: 0.3, params: { duration: 3 } },
				{ type: EffectType.Status, value: 5, params: { statusEffectId: "marked" } },
			],
		},
		bottom: {
			name: "Shield Tap",
			description: "A quick reactive guard to deflect immediate harm.",
			technical: "Reduce the next hit by 50%. Gain 30 Guard (Temp HP) for 2s on hit.",
			cooldown: 8,
			effectBlocks: [
				{ type: EffectType.MitigationMod, value: 0.5, params: { duration: 1 } },
				{ type: EffectType.Shield, value: 30, params: { duration: 2 } },
			],
		},
	},
};

export const VOW_LASH: AbilityConfig = {
	id: "vow-lash",
	name: "Vow Lash",
	description: "Force the wicked to look upon you.",
	category: AbilityCategory.Offense,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Direction,
	range: 25,
	variants: {
		top: {
			name: "Taunting Strike",
			description: "A heavy blow that demands attention.",
			technical: "Deals 40 damage and applies Strong Mark (aggro) for 6s.",
			cooldown: 12,
			effectBlocks: [
				{ type: EffectType.Damage, value: 40 },
				{ type: EffectType.Status, value: 6, params: { statusEffectId: "marked_strong" } },
			],
		},
		bottom: {
			name: "Hook & Check",
			description: "Tether your foes to keep them in range.",
			technical: "Applies 50% Slow for 3s to heavy targets. Light targets are pulled.",
			cooldown: 8,
			effectBlocks: [
				{ type: EffectType.Status, value: 3, params: { statusEffectId: "slow" } },
			],
		},
	},
};

export const SANCTUARY_STEP: AbilityConfig = {
	id: "sanctuary-step",
	name: "Sanctuary Step",
	description: "Always present where the danger is greatest.",
	category: AbilityCategory.Mobility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Entity,
	range: 40,
	variants: {
		top: {
			name: "Intercept Leap",
			description: "Leap to an ally's side and take the brunt of their pain.",
			technical: "Dash to ally. Grant them a 100 HP shield for 2s that redirects damage to you.",
			cooldown: 18,
			effectBlocks: [
				{ type: EffectType.Dash, value: 40 },
				{ type: EffectType.Shield, value: 100, params: { duration: 2, redirect: true } },
			],
		},
		bottom: {
			name: "Brace Dash",
			description: "Slide into position while maintaining your guard.",
			technical: "Short 20 stud dash. Gain 20% damage reduction for 1.5s.",
			cooldown: 8,
			effectBlocks: [
				{ type: EffectType.Dash, value: 20 },
				{ type: EffectType.MitigationMod, value: 0.2, params: { duration: 1.5 } },
			],
		},
	},
};

export const AEGIS_PULSE: AbilityConfig = {
	id: "aegis-pulse",
	name: "Aegis Pulse",
	description: "A ripple of holy energy to protect and empower.",
	category: AbilityCategory.Defense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Area,
	range: 20,
	variants: {
		top: {
			name: "Consecrated Guard",
			description: "Pulse energy that bolsters allies and weakens foes.",
			technical: "Allies gain 40 Shield. Enemies deal 20% less damage for 4s.",
			cooldown: 20,
			effectBlocks: [
				{ type: EffectType.Shield, value: 40, params: { radius: 20, duration: 4 } },
				{ type: EffectType.DamageMod, value: -0.2, params: { radius: 20, duration: 4 } },
			],
		},
		bottom: {
			name: "Rally Ping",
			description: "A focused spark to clear the mind and shield the soul.",
			technical: "Grant target ally 25 Shield and Cleanse all minor debuffs.",
			cooldown: 12,
			effectBlocks: [
				{ type: EffectType.Shield, value: 25, params: { duration: 3 } },
				{ type: EffectType.Status, value: 1, params: { statusEffectId: "cleanse" } },
			],
		},
	},
};

export const JUDGEMENT_LINE: AbilityConfig = {
	id: "judgement-line",
	name: "Judgement Line",
	description: "Draw a line that the unrighteous cannot cross.",
	category: AbilityCategory.Utility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Point,
	range: 30,
	variants: {
		top: {
			name: "Shield Line",
			description: "Slam the ground to create an impassable barrier.",
			technical: "Creates a 15 stud wall for 4s that blocks movement and projectiles.",
			cooldown: 25,
			effectBlocks: [
				{ type: EffectType.Augment, value: 4, params: { augmentId: "shield_line" } },
			],
		},
		bottom: {
			name: "Trip Bash",
			description: "A low, sweeping bash to disrupt enemies.",
			technical: "Instantly Interrupts enemy actions. Flinches medium targets.",
			cooldown: 10,
			effectBlocks: [
				{ type: EffectType.Status, value: 1, params: { statusEffectId: "interrupt" } },
			],
		},
	},
};

export const MARTYRS_PROMISE: AbilityConfig = {
	id: "martyrs-promise",
	name: "Martyr's Promise",
	description: "Sacrifice is the ultimate armor.",
	category: AbilityCategory.Utility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Entity,
	range: 50,
	variants: {
		top: {
			name: "Guardian Oath",
			description: "Bind your life to an ally to ensure their survival.",
			technical: "Redirect 50% of ally's damage to you. Gain 50% Healing Received bonus for 8s.",
			cooldown: 30,
			effectBlocks: [
				{ type: EffectType.Status, value: 8, params: { statusEffectId: "redirect_damage" } },
				{ type: EffectType.StatMod, value: 1.5, params: { statId: "healing_received", duration: 8 } },
			],
		},
		bottom: {
			name: "Hand of Mercy",
			description: "A touch of grace for those on the brink.",
			technical: "Heal for 25. Grant Knockback Resistance and Stability for 2s.",
			cooldown: 15,
			effectBlocks: [
				{ type: EffectType.Heal, value: 25 },
				{ type: EffectType.StatMod, value: 1, params: { statId: "stability", duration: 2 } },
			],
		},
	},
};

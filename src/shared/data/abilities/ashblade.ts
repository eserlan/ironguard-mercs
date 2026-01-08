import { AbilityConfig, AbilityCategory, ActivationType, TargetingType, EffectType } from "../../domain/abilities/types";

export const KINDLE_EDGE: AbilityConfig = {
	id: "kindle-edge",
	name: "Kindle Edge",
	description: "Focus heat into the blade. A dance of embers begins.",
	category: AbilityCategory.Offense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 0,
	variants: {
		top: {
			name: "Ignite Slash",
			description: "A blistering strike that sets the target aflame.",
			technical: "Deals 30 damage. Applies Scorch for 4s. Hitting Scorched targets refreshes duration.",
			cooldown: 5,
			effectBlocks: [
				{ type: EffectType.Damage, value: 30 },
				{ type: EffectType.Status, value: 4, params: { statusEffectId: "scorch" } },
			],
		},
		bottom: {
			name: "Ember Nick",
			description: "A quick, surgical cut to maintain momentum.",
			technical: "Deals 15 damage. If target is Scorched, gain 20% Speed for 2s.",
			cooldown: 3,
			effectBlocks: [
				{ type: EffectType.Damage, value: 15 },
				{ type: EffectType.StatMod, value: 1.2, params: { statId: "speed", duration: 2, condition: "target_scorched" } },
			],
		},
	},
};

export const CINDER_STEP: AbilityConfig = {
	id: "cinder-step",
	name: "Cinder Step",
	description: "Become as smoke—fleeting and unreachable.",
	category: AbilityCategory.Mobility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Direction,
	range: 30,
	variants: {
		top: {
			name: "Phase Dash",
			description: "Dash through the battlefield as a ghost of ash.",
			technical: "30 stud dash. Become Untargetable for 0.5s. Leave an Ember Trail that damages enemies.",
			cooldown: 12,
			effectBlocks: [
				{ type: EffectType.Dash, value: 30 },
				{ type: EffectType.Status, value: 0.5, params: { statusEffectId: "untargetable" } },
				{ type: EffectType.Augment, value: 2, params: { augmentId: "ember_trail" } },
			],
		},
		bottom: {
			name: "Backstep Cut",
			description: "Retreat into the shadows while punishing pursuit.",
			technical: "Hop back 15 studs. Deal 20 damage and apply 50% Slow for 2s.",
			cooldown: 6,
			effectBlocks: [
				{ type: EffectType.Dash, value: -15 },
				{ type: EffectType.Damage, value: 20 },
				{ type: EffectType.Status, value: 2, params: { statusEffectId: "slow" } },
			],
		},
	},
};

export const ASH_MARK: AbilityConfig = {
	id: "ash-mark",
	name: "Ash Mark",
	description: "Designate the target for total incineration.",
	category: AbilityCategory.Utility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Entity,
	range: 40,
	variants: {
		top: {
			name: "Brand",
			description: "Burn a seal into the enemy that weakens their resolve.",
			technical: "Target takes 25% bonus damage for 6s.",
			cooldown: 15,
			effectBlocks: [
				{ type: EffectType.DamageMod, value: 1.25, params: { duration: 6 } },
			],
		},
		bottom: {
			name: "Smoke Sign",
			description: "Choke the air and mark the kill for your team.",
			technical: "Highlight target for 3s. Reduce target accuracy by 30% for 3s.",
			cooldown: 10,
			effectBlocks: [
				{ type: EffectType.StatMod, value: -0.3, params: { statId: "accuracy", duration: 3 } },
				{ type: EffectType.Status, value: 3, params: { statusEffectId: "highlighted" } },
			],
		},
	},
};

export const FLARE_PARRY: AbilityConfig = {
	id: "flare-parry",
	name: "Flare Parry",
	description: "The blade is a shield if your timing is true.",
	category: AbilityCategory.Defense,
	activationType: ActivationType.Instant,
	targeting: TargetingType.Self,
	range: 0,
	variants: {
		top: {
			name: "Perfect Parry",
			description: "A momentary window to reflect the coming storm.",
			technical: "Negate next hit within 0.75s. Trigger Counter Slash for heavy damage on success.",
			cooldown: 15,
			effectBlocks: [
				{ type: EffectType.MitigationMod, value: 1.0, params: { duration: 0.75, triggerCounter: true } },
			],
		},
		bottom: {
			name: "Guard Flick",
			description: "Catch the edge and fuel your inner fire.",
			technical: "50% damage reduction for 1s. Gain 1 Cinder stack on block.",
			cooldown: 8,
			effectBlocks: [
				{ type: EffectType.MitigationMod, value: 0.5, params: { duration: 1.0 } },
				{ type: EffectType.StatMod, value: 1, params: { statId: "cinder_resource", duration: 5 } },
			],
		},
	},
};

export const EMBER_CHAIN: AbilityConfig = {
	id: "ember-chain",
	name: "Ember Chain",
	description: "No escape from the searing tether.",
	category: AbilityCategory.Utility,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Entity,
	range: 35,
	variants: {
		top: {
			name: "Chain Pull",
			description: "Lash out with a molten chain to close the distance.",
			technical: "Pull target or zip to target. Deal 40 AoE damage on arrival.",
			cooldown: 18,
			effectBlocks: [
				{ type: EffectType.Dash, value: 35 },
				{ type: EffectType.Damage, value: 40, params: { radius: 10 } },
			],
		},
		bottom: {
			name: "Latch",
			description: "Tether your life to theirs. They cannot run.",
			technical: "Apply Tether and 50% Slow for 2s.",
			cooldown: 10,
			effectBlocks: [
				{ type: EffectType.Status, value: 2, params: { statusEffectId: "tether" } },
				{ type: EffectType.Status, value: 2, params: { statusEffectId: "slow" } },
			],
		},
	},
};

export const BLAZE_FINISHER: AbilityConfig = {
	id: "blaze-finisher",
	name: "Blaze Finisher",
	description: "The final spark that consumes the wick.",
	category: AbilityCategory.Offense,
	activationType: ActivationType.Targeted,
	targeting: TargetingType.Entity,
	range: 10,
	variants: {
		top: {
			name: "Ashburst Execute",
			description: "Unleash all stored heat in one devastating blow.",
			technical: "Deals 100 base damage. Consumes Scorch for massive bonus damage. Heal 20 on kill.",
			cooldown: 25,
			effectBlocks: [
				{ type: EffectType.Damage, value: 100, params: { consumeScorch: true, healOnKill: 20 } },
			],
		},
		bottom: {
			name: "Sear Tap",
			description: "Keep the embers glowing for a later burst.",
			technical: "Deal 15 damage. Re-applies Scorch (4s).",
			cooldown: 5,
			effectBlocks: [
				{ type: EffectType.Damage, value: 15 },
				{ type: EffectType.Status, value: 4, params: { statusEffectId: "scorch" } },
			],
		},
	},
};

import { Vec3 } from "../world";

export enum AbilityCategory {
	Mobility = "Mobility",
	Defense = "Defense",
	Offense = "Offense",
	Utility = "Utility",
}

export enum ActivationType {
	Instant = "Instant",
	Targeted = "Targeted",
	Channel = "Channel",
}

export enum TargetingType {
	Self = "Self",
	Point = "Point",
	Direction = "Direction",
	Entity = "Entity",
	Area = "Area",
}

export enum EffectType {
	Damage = "Damage",
	Heal = "Heal",
	Status = "Status",
	Dash = "Dash",
	Shield = "Shield",
	Projectile = "Projectile",
	MitigationMod = "MitigationMod",
	DamageMod = "DamageMod",
	StatMod = "StatMod",
	Augment = "Augment",
}

export interface EffectBlock {
	type: EffectType;
	value?: number;
	params?: Record<string, unknown>;
}

export interface AbilityVariantConfig {
	name?: string;
	description?: string;
	technical?: string;
	cooldown: number;
	effectBlocks: EffectBlock[];
	cost?: number;
}

export interface AbilityConfig {
	id: string;
	name: string;
	description?: string;
	category: AbilityCategory;
	activationType: ActivationType;
	targeting: TargetingType;
	range: number;
	variants: {
		top: AbilityVariantConfig;
		bottom: AbilityVariantConfig;
	};
	tags?: string[];
}

export interface AbilityIntent {
	slotIndex: number;
	action: "Top" | "Bottom";
	seq: number;
	timestamp: number;
	payload: {
		targetId?: string;
		point?: Vec3;
		direction?: Vec3;
	};
}
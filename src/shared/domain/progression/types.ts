export enum PerkType {
	Trait = "Trait",
	Augment = "Augment",
	StatNudge = "StatNudge",
}

export enum PerkRarity {
	Common = "Common",
	Rare = "Rare",
	Legendary = "Legendary",
}

export interface RunPerk {
	id: string;
	name: string;
	type: PerkType;
	rarity: PerkRarity;
	description: string;
	effects: any[]; // Links to 003 EffectBlocks
	cap?: number;
}

export interface MetaUnlock {
	id: string;
	name: string;
	requiredLevel: number;
}

export interface ProgressionState {
	teamLevel: number;
	currentXP: number;
	nextLevelXP: number;
}

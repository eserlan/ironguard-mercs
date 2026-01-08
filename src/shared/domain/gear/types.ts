import { EffectBlock } from "../abilities/types";

export enum EquipmentSlot {
	Weapon = "Weapon",
	Offhand = "Offhand",
	Armor = "Armor",
	Utility = "Utility",
}

export enum GearType {
	Passive = "Passive",
	Active = "Active",
	Reactive = "Reactive",
	Consumable = "Consumable",
}

export enum GearRarity {
	Common = "Common",
	Uncommon = "Uncommon",
	Rare = "Rare",
	Exotic = "Exotic",
}

export interface GearItem {
	id: string;
	name: string;
	slot: EquipmentSlot;
	type: GearType;
	rarity: GearRarity;
	trigger?: string;
	effects: EffectBlock[];
	classFilter?: string[];
	cooldown?: number;
	maxCharges?: number;
}

export interface PlayerEquipment {
	slots: Map<EquipmentSlot, string>; // slot -> gearId
	sideboard: string[]; // List of gearIds
}

export enum ItemCategory {
	Gear = "Gear",
	Consumable = "Consumable",
	Material = "Material",
}

export enum ItemRarity {
	Common = "Common",
	Uncommon = "Uncommon",
	Rare = "Rare",
	Epic = "Epic",
	Legendary = "Legendary",
}

export enum EquipmentSlot {
	Weapon = "Weapon",
	Offhand = "Offhand",
	Armour = "Armour",
	Trinket1 = "Trinket1",
	Trinket2 = "Trinket2",
	Quick1 = "Quick1",
	Quick2 = "Quick2",
	Quick3 = "Quick3",
	Quick4 = "Quick4",
}

export interface ItemDefinition {
	id: string;
	name: string;
	category: ItemCategory;
	rarity: ItemRarity;
	maxStack: number;
	description: string;
	iconAssetId: string; // "rbxassetid://..."
	validSlots: EquipmentSlot[]; // Empty if not equippable
}

export interface InventoryItem {
	itemTypeId: string;
	instanceId?: string; // UUID for unique items
	quantity: number;
	metadata?: Record<string, unknown>;
}

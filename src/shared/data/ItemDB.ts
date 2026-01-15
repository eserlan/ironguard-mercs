import { EquipmentSlot, ItemCategory, ItemDefinition, ItemRarity } from "shared/domain/inventory/types";

const items: Record<string, ItemDefinition> = {
	"weapon_rusty_sword": {
		id: "weapon_rusty_sword",
		name: "Rusty Sword",
		category: ItemCategory.Gear,
		rarity: ItemRarity.Common,
		maxStack: 1,
		description: "Better than nothing.",
		iconAssetId: "rbxassetid://0", // Placeholder
		validSlots: [EquipmentSlot.Weapon],
	},
	"consumable_health_potion": {
		id: "consumable_health_potion",
		name: "Health Potion",
		category: ItemCategory.Consumable,
		rarity: ItemRarity.Common,
		maxStack: 10,
		description: "Restores a small amount of health.",
		iconAssetId: "rbxassetid://0", // Placeholder
		validSlots: [EquipmentSlot.Quick1, EquipmentSlot.Quick2, EquipmentSlot.Quick3, EquipmentSlot.Quick4],
	},
	"material_iron_ore": {
		id: "material_iron_ore",
		name: "Iron Ore",
		category: ItemCategory.Material,
		rarity: ItemRarity.Common,
		maxStack: 99,
		description: "Raw iron, suitable for smelting.",
		iconAssetId: "rbxassetid://0", // Placeholder
		validSlots: [],
	},
	"gear_shield_basic": {
		id: "gear_shield_basic",
		name: "Wooden Buckler",
		category: ItemCategory.Gear,
		rarity: ItemRarity.Common,
		maxStack: 1,
		description: "A simple wooden shield.",
		iconAssetId: "rbxassetid://0", // Placeholder
		validSlots: [EquipmentSlot.Offhand],
	},
};

export const ItemDB = {
	get: (id: string): ItemDefinition | undefined => {
		return items[id];
	},
	getAll: (): Readonly<Record<string, ItemDefinition>> => {
		return items;
	},
};

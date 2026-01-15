import { describe, it, expect } from "vitest";
import { canEquip } from "./validation";
import { EquipmentSlot, ItemCategory, ItemDefinition, ItemRarity } from "shared/domain/inventory/types";

const WEAPON_DEF: ItemDefinition = {
	id: "sword",
	name: "Sword",
	category: ItemCategory.Gear,
	rarity: ItemRarity.Common,
	maxStack: 1,
	description: "",
	iconAssetId: "",
	validSlots: [EquipmentSlot.Weapon],
};

const POTION_DEF: ItemDefinition = {
	id: "potion",
	name: "Potion",
	category: ItemCategory.Consumable,
	rarity: ItemRarity.Common,
	maxStack: 10,
	description: "",
	iconAssetId: "",
	validSlots: [EquipmentSlot.Quick1, EquipmentSlot.Quick2, EquipmentSlot.Quick3, EquipmentSlot.Quick4],
};

describe("Inventory Validation Logic", () => {
	it("should allow equipping item to valid slot", () => {
		expect(canEquip(WEAPON_DEF, EquipmentSlot.Weapon)).toBe(true);
	});

	it("should deny equipping item to invalid slot", () => {
		expect(canEquip(WEAPON_DEF, EquipmentSlot.Offhand)).toBe(false);
	});
	
	it("should allow consumable in any quick slot", () => {
		expect(canEquip(POTION_DEF, EquipmentSlot.Quick1)).toBe(true);
		expect(canEquip(POTION_DEF, EquipmentSlot.Quick4)).toBe(true);
	});

	it("should deny consumable in gear slot", () => {
		expect(canEquip(POTION_DEF, EquipmentSlot.Weapon)).toBe(false);
	});
});

import { describe, it, expect } from "vitest";
import { addItem } from "./stacking";
import { InventoryItem, ItemCategory, ItemDefinition, ItemRarity } from "shared/domain/inventory/types";

const MOCK_POTION: ItemDefinition = {
	id: "potion",
	name: "Potion",
	category: ItemCategory.Consumable,
	rarity: ItemRarity.Common,
	maxStack: 10,
	description: "",
	iconAssetId: "",
	validSlots: [],
};

const MOCK_SWORD: ItemDefinition = {
	id: "sword",
	name: "Sword",
	category: ItemCategory.Gear,
	rarity: ItemRarity.Common,
	maxStack: 1,
	description: "",
	iconAssetId: "",
	validSlots: [],
};

describe("Inventory Stacking Algorithms", () => {
	it("should add a new stackable item to an empty backpack", () => {
		const backpack: InventoryItem[] = [];
		const result = addItem(backpack, 10, MOCK_POTION, 5);

		expect(result.success).toBe(true);
		expect(result.remaining).toBe(0);
		expect(result.backpack.size()).toBe(1);
		expect(result.backpack[0].quantity).toBe(5);
		expect(result.backpack[0].itemTypeId).toBe("potion");
	});

	it("should stack onto an existing partial stack", () => {
		const backpack: InventoryItem[] = [
			{ itemTypeId: "potion", quantity: 5 },
		];
		const result = addItem(backpack, 10, MOCK_POTION, 3);

		expect(result.success).toBe(true);
		expect(result.backpack.size()).toBe(1);
		expect(result.backpack[0].quantity).toBe(8);
	});

	it("should overflow to a new stack when maxStack is reached", () => {
		const backpack: InventoryItem[] = [
			{ itemTypeId: "potion", quantity: 8 },
		];
		// Max stack is 10. Adding 5 means: 2 go to first stack, 3 go to new stack.
		const result = addItem(backpack, 10, MOCK_POTION, 5);

		expect(result.success).toBe(true);
		expect(result.backpack.size()).toBe(2);
		expect(result.backpack[0].quantity).toBe(10);
		expect(result.backpack[1].quantity).toBe(3);
	});

	it("should fail if backpack is full (capacity limit)", () => {
		const backpack: InventoryItem[] = [
			{ itemTypeId: "sword", quantity: 1 }, // 1
			{ itemTypeId: "sword", quantity: 1 }, // 2
		];
		const capacity = 2;

		// Trying to add a potion. No space.
		const result = addItem(backpack, capacity, MOCK_POTION, 1);

		expect(result.success).toBe(false);
		expect(result.remaining).toBe(1);
		expect(result.backpack.size()).toBe(2);
	});

	it("should partially fill if backpack fills up midway", () => {
		const backpack: InventoryItem[] = [
			{ itemTypeId: "potion", quantity: 8 }, // 1 (Space for 2 more)
		];
		const capacity = 1; // Only 1 slot allowed

		// Adding 5. 2 should go to existing slot. 3 need new slot but capacity is 1.
		// So we fill the 2, and fail the rest.
		const result = addItem(backpack, capacity, MOCK_POTION, 5);

		expect(result.success).toBe(false); // Not fully successful
		expect(result.remaining).toBe(3);
		expect(result.backpack[0].quantity).toBe(10);
	});
	
	it("should treat unique items as non-stackable", () => {
		const backpack: InventoryItem[] = [
			{ itemTypeId: "sword", quantity: 1, instanceId: "A" },
		];
		
		const result = addItem(backpack, 10, MOCK_SWORD, 1);
		
		expect(result.success).toBe(true);
		expect(result.backpack.size()).toBe(2);
		expect(result.backpack[0].itemTypeId).toBe("sword");
		expect(result.backpack[1].itemTypeId).toBe("sword");
	});
});

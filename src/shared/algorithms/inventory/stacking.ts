import { InventoryItem, ItemDefinition } from "shared/domain/inventory/types";
import { HttpService } from "@rbxts/services";

export interface AddItemResult {
	success: boolean;
	backpack: InventoryItem[];
	remaining: number;
}

/**
 * Pure function to add items to a backpack, respecting stack limits and capacity.
 * Returns a new backpack array (does not mutate the original if possible/needed, strictly speaking we treat it as immutable input).
 */
export function addItem(
	currentBackpack: ReadonlyArray<InventoryItem>,
	capacity: number,
	itemDef: ItemDefinition,
	quantityToAdd: number,
	instanceId?: string
): AddItemResult {
	// deep copy to avoid mutation of input
	const backpack = table.clone(currentBackpack) as InventoryItem[];
	let remaining = quantityToAdd;

	// 1. Try to stack onto existing items if item is stackable
	if (itemDef.maxStack > 1) {
		for (const item of backpack) {
			if (remaining <= 0) break;

			// Check if compatible for stacking
			if (item.itemTypeId === itemDef.id && item.quantity < itemDef.maxStack) {
				const spaceInStack = itemDef.maxStack - item.quantity;
				const amountToAdd = math.min(spaceInStack, remaining);

				item.quantity += amountToAdd;
				remaining -= amountToAdd;
			}
		}
	}

	// 2. If still remaining, create new slots
	while (remaining > 0) {
		if (backpack.size() >= capacity) {
			// No more space
			return {
				success: false,
				backpack: backpack,
				remaining: remaining,
			};
		}

		const amountForNewStack = math.min(itemDef.maxStack, remaining);
		
		const newItem: InventoryItem = {
			itemTypeId: itemDef.id,
			quantity: amountForNewStack,
		};
		
		// Assign instance ID if provided (usually for unique items)
		// Or generate one if it's a unique item type (maxStack == 1) and none provided? 
		// For now, we trust the caller or just pass it through.
		// If maxStack == 1, usually implies unique gear.
		if (itemDef.maxStack === 1) {
			newItem.instanceId = instanceId ?? HttpService.GenerateGUID(false);
		}

		backpack.push(newItem);
		remaining -= amountForNewStack;
	}

	return {
		success: true,
		backpack: backpack,
		remaining: 0,
	};
}

import { EquipmentSlot, ItemDefinition } from "shared/domain/inventory/types";

export function canEquip(itemDef: ItemDefinition, slot: EquipmentSlot): boolean {
	if (!itemDef.validSlots || itemDef.validSlots.size() === 0) {
		return false;
	}
	
	// Check if slot is in validSlots array
	// Note: in Lua/Roblox-TS validSlots.includes() or similar
	// But using polyfilled array methods or standard loops
	for (const validSlot of itemDef.validSlots) {
		if (validSlot === slot) {
			return true;
		}
	}
	
	return false;
}

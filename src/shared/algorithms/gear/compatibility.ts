import { GearItem, GearRarity } from "../../domain/gear/types";

export function canEquip(item: GearItem, currentEquipment: Record<string, GearItem>): { allowed: boolean; reason?: string } {
	// 1. Check Class Filter
	// ...

	// 2. Check Exotic Limit
	if (item.rarity === GearRarity.Exotic) {
		for (const [_, equipped] of pairs(currentEquipment)) {
			if (equipped.rarity === GearRarity.Exotic && equipped.id !== item.id) {
				return { allowed: false, reason: "ExoticLimit" };
			}
		}
	}

	return { allowed: true };
}

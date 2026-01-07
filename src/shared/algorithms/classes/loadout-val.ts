import { PlayerLoadout, ClassConfig } from "../../domain/classes/types";

export function validateLoadout(
	loadout: PlayerLoadout,
	config: ClassConfig,
): { valid: boolean; reason?: string } {
	if (loadout.classId !== config.id) return { valid: false, reason: "ClassMismatch" };
	if (loadout.equippedSlots.size() > 4) return { valid: false, reason: "TooManySlots" };

	const library = new Set(config.abilityLibrary);
	for (const slot of loadout.equippedSlots) {
		if (!library.has(slot.abilityId)) {
			return { valid: false, reason: `AbilityNotInLibrary:${slot.abilityId}` };
		}
	}

	return { valid: true };
}

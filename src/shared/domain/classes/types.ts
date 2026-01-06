export type ClassId = string;

export enum ClassRole {
	Protector = "Protector",
	Striker = "Striker",
}

export interface LoadoutRules {
	slots: number;
	duplicatesAllowed: boolean;
}

export interface ClassConfig {
	id: ClassId;
	name: string;
	role: ClassRole;
	abilityLibrary: string[]; // AbilityIds
	baseStats: Record<string, number>;
}

export interface EquippedSlot {
	slotIndex: number;
	abilityId: string;
}

export interface PlayerLoadout {
	classId: ClassId;
	equippedSlots: EquippedSlot[];
}

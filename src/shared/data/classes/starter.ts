import { ClassConfig, ClassRole } from "../../domain/classes/types";

export const SHIELD_SAINT: ClassConfig = {
	id: "shield-saint",
	name: "Shield Saint",
	role: ClassRole.Protector,
	abilityLibrary: ["shield-wall", "bash", "rescue-leap"],
	baseStats: { hp: 150, speed: 14, defense: 50 },
};

export const ASHBLADE: ClassConfig = {
	id: "ashblade",
	name: "Ashblade",
	role: ClassRole.Striker,
	abilityLibrary: ["lunge", "execute", "shadowstep"],
	baseStats: { hp: 80, speed: 20, defense: 10 },
};

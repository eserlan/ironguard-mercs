import { EnemyArchetype } from "../../domain/enemies/config";
import { EnemyRole, EnemyTier } from "../../domain/enemies/enemy-types";

export const VOID_STALKER: EnemyArchetype = {
	id: "void-stalker",
	name: "Void Stalker",
	role: EnemyRole.Assassin,
	tier: EnemyTier.Elite,
	stats: { hp: 180, speed: 24, mitigation: 10, threatBiasMultiplier: 0.5 },
	moves: [{ id: "ambush", cooldown: 6, telegraph: { type: "Circle", duration: 1.0, radius: 6 }, interruptible: true, breakable: false }],
	breakThreshold: 60,
	visual: { profileKey: "Slasher", weaponKey: "VoidDagger" },
};

export const IRON_REAPER: EnemyArchetype = {
	id: "iron-reaper",
	name: "Iron Reaper",
	role: EnemyRole.Assassin,
	tier: EnemyTier.Elite,
	stats: { hp: 200, speed: 22, mitigation: 15, threatBiasMultiplier: 0.6 },
	moves: [{ id: "execute", cooldown: 7, telegraph: { type: "Line", duration: 1.2, length: 15 }, interruptible: true, breakable: false }],
	breakThreshold: 65,
	visual: { profileKey: "Slasher", weaponKey: "IronScythe" },
};

export const IRON_MEDIC: EnemyArchetype = {
	id: "iron-medic",
	name: "Iron Medic",
	role: EnemyRole.Support,
	tier: EnemyTier.Elite,
	stats: { hp: 200, speed: 14, mitigation: 10, threatBiasMultiplier: 1 },
	moves: [{ id: "heal-aura", cooldown: 12, telegraph: { type: "Circle", duration: 2.0, radius: 15 }, interruptible: true, breakable: false }],
	breakThreshold: 50,
	visual: { profileKey: "Guard", weaponKey: "MedicStaff" },
};

export const VOID_ORACLE: EnemyArchetype = {
	id: "void-oracle",
	name: "Void Oracle",
	role: EnemyRole.Support,
	tier: EnemyTier.Elite,
	stats: { hp: 180, speed: 12, mitigation: 5, threatBiasMultiplier: 0.9 },
	moves: [{ id: "void-shield", cooldown: 10, telegraph: { type: "Circle", duration: 1.8, radius: 18 }, interruptible: true, breakable: false }],
	breakThreshold: 45,
	visual: { profileKey: "Guard", weaponKey: "VoidScepter" },
};

export const VOID_HAZARD: EnemyArchetype = {
	id: "void-hazard",
	name: "Void Hazard",
	role: EnemyRole.Hazard,
	tier: EnemyTier.Elite,
	stats: { hp: 150, speed: 0, mitigation: 60, threatBiasMultiplier: 0 },
	moves: [{ id: "corruption-wave", cooldown: 5, telegraph: { type: "Circle", duration: 1.5, radius: 25 }, interruptible: false, breakable: true }],
	breakThreshold: 150,
	visual: { profileKey: "Guard" },
};

export const IRON_TURRET: EnemyArchetype = {
	id: "iron-turret",
	name: "Iron Turret",
	role: EnemyRole.Hazard,
	tier: EnemyTier.Elite,
	stats: { hp: 200, speed: 0, mitigation: 70, threatBiasMultiplier: 0 },
	moves: [{ id: "auto-cannon", cooldown: 4, telegraph: { type: "Line", duration: 1.0, length: 50 }, interruptible: false, breakable: true }],
	breakThreshold: 180,
	visual: { profileKey: "Guard" },
};

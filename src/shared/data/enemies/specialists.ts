import { EnemyArchetype } from "../../domain/enemies/config";
import { EnemyRole, EnemyTier } from "../../domain/enemies/types";

export const VOID_STALKER: EnemyArchetype = {
	id: "void-stalker",
	name: "Void Stalker",
	role: EnemyRole.Assassin,
	tier: EnemyTier.Elite,
	stats: { hp: 180, speed: 24, mitigation: 10, threatBiasMultiplier: 0.5 },
	moves: [{ id: "ambush", cooldown: 6, telegraph: { type: "Circle", duration: 1.0, radius: 6 }, interruptible: true, breakable: false }],
	breakThreshold: 60,
};

export const IRON_MEDIC: EnemyArchetype = {
	id: "iron-medic",
	name: "Iron Medic",
	role: EnemyRole.Support,
	tier: EnemyTier.Elite,
	stats: { hp: 200, speed: 14, mitigation: 10, threatBiasMultiplier: 1 },
	moves: [{ id: "heal-aura", cooldown: 12, telegraph: { type: "Circle", duration: 2.0, radius: 15 }, interruptible: true, breakable: false }],
	breakThreshold: 50,
};

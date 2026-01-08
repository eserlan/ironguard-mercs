import { EnemyArchetype } from "../../domain/enemies/config";
import { EnemyRole, EnemyTier } from "../../domain/enemies/enemy-types";

export const VOID_REAVER: EnemyArchetype = {
	id: "void-reaver",
	name: "Void Reaver",
	role: EnemyRole.Bruiser,
	tier: EnemyTier.Champion,
	stats: { hp: 1200, speed: 18, mitigation: 30, threatBiasMultiplier: 1.5 },
	moves: [{ id: "annihilate", cooldown: 15, telegraph: { type: "Circle", duration: 3.0, radius: 25 }, interruptible: false, breakable: true }],
	breakThreshold: 200,
};

export const IRON_OVERSEER: EnemyArchetype = {
	id: "iron-overseer",
	name: "Iron Overseer",
	role: EnemyRole.Tank,
	tier: EnemyTier.Boss,
	stats: { hp: 5000, speed: 10, mitigation: 50, threatBiasMultiplier: 2.0 },
	moves: [{ id: "orbital-strike", cooldown: 20, telegraph: { type: "Circle", duration: 4.0, radius: 30 }, interruptible: false, breakable: true }],
	breakThreshold: 500,
};

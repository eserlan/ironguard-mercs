import { EnemyArchetype } from "../../domain/enemies/config";
import { EnemyRole, EnemyTier } from "../../domain/enemies/enemy-types";

export const VOID_SWARM: EnemyArchetype = {
	id: "void-swarm",
	name: "Void Swarm",
	role: EnemyRole.Swarm,
	tier: EnemyTier.Minion,
	stats: { hp: 30, speed: 22, mitigation: 0, threatBiasMultiplier: 1 },
	moves: [{ id: "nibble", cooldown: 1, telegraph: { type: "Circle", duration: 0.5, radius: 4 }, interruptible: true, breakable: false }],
	breakThreshold: 10,
};

export const IRON_GRUNT: EnemyArchetype = {
	id: "iron-grunt",
	name: "Iron Grunt",
	role: EnemyRole.Bruiser,
	tier: EnemyTier.Minion,
	stats: { hp: 120, speed: 14, mitigation: 10, threatBiasMultiplier: 1.2 },
	moves: [{ id: "heavy-swing", cooldown: 3, telegraph: { type: "Cone", duration: 1.2, angle: 60, radius: 8 }, interruptible: true, breakable: false }],
	breakThreshold: 40,
};

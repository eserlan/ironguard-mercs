import { EnemyArchetype } from "../../domain/enemies/config";
import { EnemyRole, EnemyTier } from "../../domain/enemies/enemy-types";

export const VOID_BINDER: EnemyArchetype = {
	id: "void-binder",
	name: "Void Binder",
	role: EnemyRole.Controller,
	tier: EnemyTier.Elite,
	stats: { hp: 300, speed: 12, mitigation: 20, threatBiasMultiplier: 1 },
	moves: [{ id: "shackle", cooldown: 8, telegraph: { type: "Circle", duration: 2.0, radius: 12 }, interruptible: true, breakable: false }],
	breakThreshold: 80,
};

export const IRON_SENTRY: EnemyArchetype = {
	id: "iron-sentry",
	name: "Iron Sentry",
	role: EnemyRole.Artillery,
	tier: EnemyTier.Elite,
	stats: { hp: 250, speed: 8, mitigation: 40, threatBiasMultiplier: 1 },
	moves: [{ id: "volley", cooldown: 10, telegraph: { type: "Line", duration: 2.5, length: 100 }, interruptible: true, breakable: false }],
	breakThreshold: 100,
};

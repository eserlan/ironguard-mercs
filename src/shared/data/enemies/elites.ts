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

export const IRON_WARLOCK: EnemyArchetype = {
	id: "iron-warlock",
	name: "Iron Warlock",
	role: EnemyRole.Controller,
	tier: EnemyTier.Elite,
	stats: { hp: 280, speed: 10, mitigation: 25, threatBiasMultiplier: 0.9 },
	moves: [{ id: "magnetic-pulse", cooldown: 9, telegraph: { type: "Cone", duration: 2.2, angle: 90, radius: 15 }, interruptible: true, breakable: false }],
	breakThreshold: 85,
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

export const VOID_HOWLER: EnemyArchetype = {
	id: "void-howler",
	name: "Void Howler",
	role: EnemyRole.Artillery,
	tier: EnemyTier.Elite,
	stats: { hp: 220, speed: 10, mitigation: 15, threatBiasMultiplier: 0.8 },
	moves: [{ id: "dark-blast", cooldown: 8, telegraph: { type: "Circle", duration: 2.0, radius: 20 }, interruptible: true, breakable: false }],
	breakThreshold: 90,
};

export const VOID_BULWARK: EnemyArchetype = {
	id: "void-bulwark",
	name: "Void Bulwark",
	role: EnemyRole.Tank,
	tier: EnemyTier.Elite,
	stats: { hp: 450, speed: 8, mitigation: 50, threatBiasMultiplier: 1.8 },
	moves: [{ id: "shield-slam", cooldown: 7, telegraph: { type: "Cone", duration: 1.8, angle: 45, radius: 10 }, interruptible: true, breakable: false }],
	breakThreshold: 120,
};

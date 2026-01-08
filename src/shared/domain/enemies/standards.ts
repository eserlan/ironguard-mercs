import { EnemyTier } from "./enemy-types";

export const TELEGRAPH_STANDARDS = {
	[EnemyTier.Minion]: { windup: 1.0, aftermath: 0.5 },
	[EnemyTier.Elite]: { windup: 1.5, aftermath: 0.8 },
	[EnemyTier.Champion]: { windup: 2.0, aftermath: 1.2 },
	[EnemyTier.Boss]: { windup: 3.0, aftermath: 2.0 },
};

export const IMPACT_VALUES = {
	LIGHT: 5,
	MEDIUM: 20,
	HEAVY: 50,
	BREAKER: 100,
};

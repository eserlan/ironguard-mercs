import { EnemyTier } from "../../domain/enemies/types";

export const TIER_COSTS = {
	[EnemyTier.Minion]: 10,
	[EnemyTier.Elite]: 40,
	[EnemyTier.Champion]: 100,
	[EnemyTier.Boss]: 500,
};

export function calculateMaxEnemies(budget: number, tier: EnemyTier): number {
	return math.floor(budget / TIER_COSTS[tier]);
}

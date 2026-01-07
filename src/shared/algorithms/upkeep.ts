import { Mercenary } from "../domain/roster";

export function calculateUpkeep(merc: Mercenary): number {
	// Upkeep = Level * 10
	return merc.level * 10;
}

export function calculateRecoveryTime(curHealth: number, maxHealth: number): number {
	if (curHealth >= maxHealth) return 0;
	const missing = maxHealth - curHealth;
	// 1 second per 1 HP missing (scaled for MVP)
	return missing;
}

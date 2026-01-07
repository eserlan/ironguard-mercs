import { Mercenary } from "../domain/roster";

export function calculateUpkeep(merc: Mercenary): number {
	// Upkeep = Level * 10
	return merc.level * 10;
}

export function calculateRecoveryTime(curHealth: number, maxHealth: number): number {
	if (maxHealth <= 0) return 0;
	
	// Clamp curHealth to 0 to handle negative health states (overkill)
	const effectiveHealth = math.max(0, curHealth);
	
	if (effectiveHealth >= maxHealth) return 0;
	
	const missing = maxHealth - effectiveHealth;
	// 1 second per 1 HP missing (scaled for MVP)
	return missing;
}

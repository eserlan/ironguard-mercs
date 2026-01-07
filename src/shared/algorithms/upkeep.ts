import { Mercenary } from "../domain/roster";

/**
 * Calculates the gold cost required to deploy a mercenary for a single mission.
 * @param merc The mercenary unit being deployed.
 * @returns The gold amount for upkeep.
 */
export function calculateUpkeep(merc: Mercenary): number {
	// Upkeep = Level * 10
	return merc.level * 10;
}

/**
 * Calculates the time in seconds a mercenary must rest before being deployable again.
 * @param curHealth The current health of the mercenary.
 * @param maxHealth The maximum health capacity of the mercenary.
 * @returns The recovery time in seconds.
 */
export function calculateRecoveryTime(curHealth: number, maxHealth: number): number {
	if (maxHealth <= 0) return 0;

	// Clamp curHealth to 0 to handle negative health states (overkill)
	const effectiveHealth = curHealth < 0 ? 0 : curHealth;

	if (effectiveHealth >= maxHealth) return 0;

	const missing = maxHealth - effectiveHealth;
	// 1 second per 1 HP missing (scaled for MVP)
	return missing;
}

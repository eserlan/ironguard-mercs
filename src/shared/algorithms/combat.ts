import { CombatStats } from "../domain/combat/types";

/**
 * Computes the outgoing damage for an attack using the provided combat stats.
 * 
 * @deprecated Use {@link resolveDamage} in `shared/algorithms/combat/damage.ts` for weapon-based resolution.
 * This is kept for generic spell/effect damage that doesn't use a weapon.
 *
 * Synergy is a multiplicative bonus that scales {@link CombatStats.baseDamage}
 * when a specific condition is met (for example, when the attacker is comboing,
 * flanking, or otherwise benefiting from a team/ability synergy). When
 * {@code isSynergyActive} is true, the final damage is:
 *
 *   {@code baseDamage * (1 + synergyMultiplier)}.
 *
 * Stats:
 * - {@link CombatStats.baseDamage} — the raw damage value before any synergy
 *   or critical modifiers are applied.
 * - {@link CombatStats.synergyMultiplier} — fractional bonus applied only
 *   while synergy is active (e.g. 0.25 for +25% damage).
 * - {@link CombatStats.critChance} — probability (0–1) that an attack is a
 *   critical hit. This function does not roll RNG; callers should roll crits
 *   externally and decide whether to apply {@link CombatStats.critMultiplier}.
 * - {@link CombatStats.critMultiplier} — multiplier applied to damage when a
 *   critical hit occurs (e.g. 2.0 for 200% damage). It is part of the stats
 *   contract but not applied directly by this function.
 *
 * Damage calculation:
 * 1. Start from {@link CombatStats.baseDamage}.
 * 2. If {@code isSynergyActive} is true, multiply by {@code (1 + synergyMultiplier)}.
 * 3. Return the resulting value without applying any critical hit logic.
 *
 * @param stats           Complete combat stats for this damage instance.
 * @param isSynergyActive Whether the synergy bonus should be applied.
 * @returns The computed damage after applying synergy, excluding crit effects.
 */
export function calculateDamage(stats: CombatStats, isSynergyActive: boolean): number {
	let damage = stats.baseDamage;

	if (isSynergyActive) {
		damage *= (1 + stats.synergyMultiplier);
	}

	// Simple crit check (RNG would be handled by caller)
	return damage;
}

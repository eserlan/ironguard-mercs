export interface CombatStats {
	baseDamage: number;
	synergyMultiplier: number;
	critChance: number;
	critMultiplier: number;
}

export function calculateDamage(stats: CombatStats, isSynergyActive: boolean): number {
	let damage = stats.baseDamage;
	
	if (isSynergyActive) {
		damage *= (1 + stats.synergyMultiplier);
	}
	
	// Simple crit check (RNG would be handled by caller)
	return damage;
}

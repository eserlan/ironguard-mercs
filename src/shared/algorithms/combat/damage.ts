import { WeaponConfig } from "../../domain/combat/config";
import { calculateMitigation } from "./mitigation";
import { rollCrit } from "./crit";
import { CombatRNG } from "./rng";
import { DamageResult, CombatStats } from "../../domain/combat/types";

export function resolveDamage(
	attackerId: string,
	targetId: string,
	weapon: WeaponConfig,
	stats: CombatStats,
	isSynergyActive: boolean,
	armor: number,
	rng: CombatRNG,
	targetCurrentHp: number,
	isBlocking?: boolean,
): DamageResult {
	let baseDamage = weapon.damage + stats.baseDamage;
	if (isSynergyActive) {
		baseDamage *= (1 + stats.synergyMultiplier);
	}

	const { amount: critAmount, isCrit } = rollCrit(baseDamage, stats.critChance, stats.critMultiplier, rng);
	const finalAmount = calculateMitigation(critAmount, armor);
	let amount = math.max(0, finalAmount);

	if (isBlocking) {
		amount = math.floor(amount * 0.5);
	}

	return {
		amount,
		isCrit,
		targetId,
		isFatal: targetCurrentHp <= amount,
	};
}
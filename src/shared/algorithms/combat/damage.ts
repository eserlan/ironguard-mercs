import { WeaponConfig } from "../../domain/combat/config";
import { calculateMitigation } from "./mitigation";
import { rollCrit } from "./crit";
import { CombatRNG } from "./rng";
import { DamageResult } from "../../domain/combat/types";

export function resolveDamage(
	attackerId: string,
	targetId: string,
	weapon: WeaponConfig,
	armor: number,
	rng: CombatRNG,
	targetCurrentHp: number,
): DamageResult {
	const { amount: critAmount, isCrit } = rollCrit(weapon.damage, 0.1, 2.0, rng);
	const finalAmount = calculateMitigation(critAmount, armor);
	const amount = math.max(0, finalAmount);

	return {
		amount,
		isCrit,
		targetId,
		isFatal: targetCurrentHp <= amount,
	};
}
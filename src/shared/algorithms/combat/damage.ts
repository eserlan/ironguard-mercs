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
    rng: CombatRNG
): DamageResult {
    const { amount: critAmount, isCrit } = rollCrit(weapon.damage, 0.1, 2.0, rng);
    const finalAmount = calculateMitigation(critAmount, armor);
    
    return {
        amount: math.max(0, finalAmount),
        isCrit,
        targetId,
        isFatal: false
    };
}

import { CombatRNG } from "./rng";

export function rollCrit(base: number, chance: number, multiplier: number, rng: CombatRNG): { amount: number, isCrit: boolean } {
    if (rng.rollCrit(chance)) {
        return { amount: base * multiplier, isCrit: true };
    }
    return { amount: base, isCrit: false };
}

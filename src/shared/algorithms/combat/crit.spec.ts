import { describe, it, expect } from 'vitest';
import { rollCrit } from './crit';
import { CombatRNG } from './rng';

describe('Crit Logic', () => {
    it('should return base damage when not a crit', () => {
        const rng = new CombatRNG(1); // Known seed
        // With seed 1, next() might be high
        const result = rollCrit(10, 0, 2, rng);
        expect(result.isCrit).toBe(false);
        expect(result.amount).toBe(10);
    });

    it('should multiply damage when crit is successful', () => {
        const rng = new CombatRNG(1);
        const result = rollCrit(10, 1.0, 2, rng); // 100% chance
        expect(result.isCrit).toBe(true);
        expect(result.amount).toBe(20);
    });
});

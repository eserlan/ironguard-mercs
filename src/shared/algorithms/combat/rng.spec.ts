import { describe, it, expect } from 'vitest';
import { CombatRNG } from './rng';

describe('CombatRNG', () => {
    it('is deterministic', () => {
        const c1 = new CombatRNG(1);
        const c2 = new CombatRNG(1);
        expect(c1.rollCrit(0.5)).toBe(c2.rollCrit(0.5));
    });
});

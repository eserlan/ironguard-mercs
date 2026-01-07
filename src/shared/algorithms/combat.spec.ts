import { describe, it, expect } from 'vitest';
import { calculateDamage, CombatStats } from './combat';

describe('Combat Algorithms', () => {
    const stats: CombatStats = {
        baseDamage: 10,
        synergyMultiplier: 0.5,
        critChance: 0.1,
        critMultiplier: 2.0
    };

    it('should calculate base damage when no synergy is active', () => {
        const damage = calculateDamage(stats, false);
        expect(damage).toBe(10);
    });

    it('should apply synergy multiplier when synergy is active', () => {
        const damage = calculateDamage(stats, true);
        expect(damage).toBe(15); // 10 * (1 + 0.5)
    });
});

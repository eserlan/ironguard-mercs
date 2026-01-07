import { describe, it, expect } from 'vitest';
import { calculateUpkeep, calculateRecoveryTime } from './upkeep';
import { Mercenary } from '../domain/roster';

describe('Upkeep & Recovery Algorithms', () => {
    const merc: Mercenary = {
        id: "m1",
        name: "Test",
        className: "Warrior",
        level: 5,
        xp: 0,
        curHealth: 50,
        equippedGear: []
    };

    it('should calculate upkeep based on level', () => {
        expect(calculateUpkeep(merc)).toBe(50);
    });

    it('should calculate recovery time based on missing health', () => {
        expect(calculateRecoveryTime(50, 100)).toBe(50);
        expect(calculateRecoveryTime(100, 100)).toBe(0);
    });

    it('should handle edge cases in recovery time', () => {
        expect(calculateRecoveryTime(-50, 100)).toBe(100); // Clamped to 0
        expect(calculateRecoveryTime(50, 0)).toBe(0);      // Invalid maxHealth
        expect(calculateRecoveryTime(50, -10)).toBe(0);   // Invalid maxHealth
    });
});

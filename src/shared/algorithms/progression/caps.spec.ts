import { describe, it, expect } from 'vitest';
import { clampStat } from './caps';

describe('clampStat', () => {
    it('clamps cooldown reduction', () => {
        expect(clampStat('COOLDOWN_REDUCTION', 0.5)).toBe(0.4);
        expect(clampStat('COOLDOWN_REDUCTION', 0.2)).toBe(0.2);
    });

    it('clamps speed amp', () => {
        expect(clampStat('SPEED_AMP', 2.0)).toBe(1.5);
    });
});

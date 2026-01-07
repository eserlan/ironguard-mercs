import { describe, it, expect } from 'vitest';
import { aggregateModifiers, Modifier } from './stacking-rules';

describe('aggregateModifiers', () => {
    it('returns 1 for empty array', () => {
        expect(aggregateModifiers([])).toBe(1);
    });

    it('aggregates only multipliers', () => {
        const mods: Modifier[] = [
            { type: 'multiplier', value: 1.5 },
            { type: 'multiplier', value: 2 },
        ];
        expect(aggregateModifiers(mods)).toBe(3); // 1.5 * 2 = 3
    });

    it('aggregates only additives', () => {
        const mods: Modifier[] = [
            { type: 'additive', value: 10 },
            { type: 'additive', value: 5 },
        ];
        expect(aggregateModifiers(mods)).toBe(16); // 1 + (10 + 5) = 16
    });

    it('combines multipliers and additives', () => {
        const mods: Modifier[] = [
            { type: 'multiplier', value: 2 },
            { type: 'additive', value: 10 },
            { type: 'multiplier', value: 1.5 },
        ];
        expect(aggregateModifiers(mods)).toBe(13); // (2 * 1.5) + 10 = 13
    });

    it('handles single multiplier', () => {
        const mods: Modifier[] = [{ type: 'multiplier', value: 2.5 }];
        expect(aggregateModifiers(mods)).toBe(2.5); // 2.5 + 0 = 2.5
    });

    it('handles single additive', () => {
        const mods: Modifier[] = [{ type: 'additive', value: 7 }];
        expect(aggregateModifiers(mods)).toBe(8); // 1 + 7 = 8
    });

    it('handles zero values', () => {
        const mods: Modifier[] = [
            { type: 'multiplier', value: 0 },
            { type: 'additive', value: 5 },
        ];
        expect(aggregateModifiers(mods)).toBe(5); // 0 + 5 = 5
    });

    it('handles negative additives', () => {
        const mods: Modifier[] = [
            { type: 'multiplier', value: 2 },
            { type: 'additive', value: -3 },
        ];
        expect(aggregateModifiers(mods)).toBe(-1); // 2 + (-3) = -1
    });
});

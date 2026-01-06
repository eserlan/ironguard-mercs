import { describe, it, expect } from 'vitest';
import { applyVariant, VariantType } from './variants';

describe('applyVariant', () => {
    const baseStats = { hp: 100, speed: 10, mitigation: 0, threatBiasMultiplier: 1 };

    it('applies Armoured variant', () => {
        const stats = applyVariant(baseStats, VariantType.Armoured);
        expect(stats.mitigation).toBe(20);
        expect(stats.speed).toBe(8);
    });

    it('applies Frost variant', () => {
        const stats = applyVariant(baseStats, VariantType.Frost);
        expect(stats.speed).toBe(7);
    });

    it('applies Cursed variant', () => {
        const stats = applyVariant(baseStats, VariantType.Cursed);
        expect(stats.hp).toBe(70);
    });
});

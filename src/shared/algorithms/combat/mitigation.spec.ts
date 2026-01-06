import { describe, it, expect } from 'vitest';
import { calculateMitigation } from './mitigation';

describe('calculateMitigation', () => {
    it('reduces damage with armor', () => {
        expect(calculateMitigation(100, 100)).toBe(50); // 100 / 200 = 0.5
    });
    it('handles zero armor', () => {
        expect(calculateMitigation(100, 0)).toBe(100);
    });
});

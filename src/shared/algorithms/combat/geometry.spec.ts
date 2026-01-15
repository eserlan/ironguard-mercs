import { describe, it, expect, vi, beforeAll } from 'vitest';

// Polyfill Luau math for Node environment
beforeAll(() => {
    vi.stubGlobal('math', {
        sqrt: Math.sqrt,
        cos: Math.cos,
        rad: (deg: number) => deg * (Math.PI / 180)
    });
});

import { isPointInMeleeArc } from './geometry';

describe('isPointInMeleeArc', () => {
    const origin = { X: 0, Y: 0, Z: 0 };
    const facingNorth = { X: 0, Y: 0, Z: -1 }; // Roblox Forward is -Z
    const range = 10;

    it('returns true if target is directly in front', () => {
        const target = { X: 0, Y: 0, Z: -5 };
        expect(isPointInMeleeArc(origin, facingNorth, target, range, 90)).toBe(true);
    });

    it('returns false if target is out of range', () => {
        const target = { X: 0, Y: 0, Z: -11 };
        expect(isPointInMeleeArc(origin, facingNorth, target, range, 90)).toBe(false);
    });

    it('returns true if target is within 90 degree arc (< 45 deg side)', () => {
        // -4, -6 => angle approx 33 deg (well within 45)
        const target = { X: -4, Y: 0, Z: -6 };
        expect(isPointInMeleeArc(origin, facingNorth, target, range, 90)).toBe(true);
    });

    it('returns false if target is outside 90 degree arc (> 45 deg side)', () => {
        // -6, -4 => angle approx 56 deg (outside 45)
        const target = { X: -6, Y: 0, Z: -4 };
        expect(isPointInMeleeArc(origin, facingNorth, target, range, 90)).toBe(false);
    });

    it('returns true for 360 arc even if behind', () => {
        const target = { X: 0, Y: 0, Z: 5 }; // Behind
        expect(isPointInMeleeArc(origin, facingNorth, target, range, 360)).toBe(true);
    });

    it('returns false if target is exactly sideways for 90 degree arc', () => {
        // z=0 is 90 degrees from z=-1
        const target = { X: 5, Y: 0, Z: 0 };
        expect(isPointInMeleeArc(origin, facingNorth, target, range, 90)).toBe(false);
    });
});

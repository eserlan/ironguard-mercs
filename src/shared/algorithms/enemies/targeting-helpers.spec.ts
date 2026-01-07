import { describe, it, expect, vi } from 'vitest';
import { isIsolated, isLowHp } from './targeting-helpers';

// Mock Vector3 for Vitest
class Vector3 {
    constructor(public X: number, public Y: number, public Z: number) { }
    get Magnitude() {
        return math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }
    sub(other: Vector3) {
        return new Vector3(this.X - other.X, this.Y - other.Y, this.Z - other.Z);
    }
    IsClose(other: Vector3, epsilon: number) {
        return this.sub(other).Magnitude < epsilon;
    }
}

(globalThis as any).Vector3 = Vector3;

describe('targeting-helpers', () => {
    describe('isIsolated', () => {
        it('returns true when no neighbors', () => {
            expect(isIsolated(new Vector3(0, 0, 0), [])).toBe(true);
        });

        it('returns false when neighbor is close', () => {
            const neighbors = [new Vector3(10, 0, 0)];
            expect(isIsolated(new Vector3(0, 0, 0), neighbors)).toBe(false);
        });

        it('returns true when neighbor is far', () => {
            const neighbors = [new Vector3(40, 0, 0)];
            expect(isIsolated(new Vector3(0, 0, 0), neighbors)).toBe(true);
        });
    });

    describe('isLowHp', () => {
        it('returns true when below 30%', () => {
            expect(isLowHp(29, 100)).toBe(true);
        });

        it('returns false when at or above 30%', () => {
            expect(isLowHp(30, 100)).toBe(false);
            expect(isLowHp(50, 100)).toBe(false);
        });
    });
});

import { describe, it, expect } from 'vitest';
import { recordDamage } from './attribution';

describe('recordDamage', () => {
    it('aggregates damage from same attacker', () => {
        const history: Record<string, number> = {};
        recordDamage(history, 'p1', 50);
        recordDamage(history, 'p1', 30);
        expect(history['p1']).toBe(80);
    });

    it('separates damage from different attackers', () => {
        const history: Record<string, number> = {};
        recordDamage(history, 'p1', 50);
        recordDamage(history, 'p2', 30);
        expect(history['p1']).toBe(50);
        expect(history['p2']).toBe(30);
    });
});

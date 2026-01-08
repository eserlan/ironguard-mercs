import { describe, it, expect } from 'vitest';
import { calculateMaxEnemies } from './budget';
import { EnemyTier } from '../../domain/enemies/enemy-types';

describe('calculateMaxEnemies', () => {
    it('calculates for minion', () => {
        expect(calculateMaxEnemies(100, EnemyTier.Minion)).toBe(10);
    });

    it('calculates for elite', () => {
        expect(calculateMaxEnemies(100, EnemyTier.Elite)).toBe(2);
    });

    it('returns 0 for insufficient budget', () => {
        expect(calculateMaxEnemies(5, EnemyTier.Minion)).toBe(0);
    });
});

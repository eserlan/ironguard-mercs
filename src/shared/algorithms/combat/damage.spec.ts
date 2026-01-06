import { describe, it, expect } from 'vitest';
import { resolveDamage } from './damage';
import { WeaponType } from '../../domain/combat/config';
import { CombatRNG } from './rng';

describe('resolveDamage', () => {
    it('calculates damage', () => {
        const weapon = { id: 'test', type: WeaponType.Melee, damage: 100, cooldown: 1, range: 5 };
        const rng = new CombatRNG(1);
        const result = resolveDamage('p1', 'e1', weapon, 0, rng);
        expect(result.amount).toBe(100);
    });
});

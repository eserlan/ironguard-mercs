import { describe, it, expect } from 'vitest';
import { resolveDamage } from './damage';
import { WeaponType } from '../../domain/combat/config';
import { CombatRNG } from './rng';

describe('resolveDamage', () => {
	const weapon = { id: 'test', type: WeaponType.Melee, damage: 100, cooldown: 1, range: 5 };
	const rng = new CombatRNG(1);

	it('calculates damage', () => {
		const result = resolveDamage('p1', 'e1', weapon, 0, rng, 500);
		expect(result.amount).toBe(100);
		expect(result.isFatal).toBe(false);
	});

	it('detects fatal damage', () => {
		const result = resolveDamage('p1', 'e1', weapon, 0, rng, 50);
		expect(result.amount).toBe(100);
		expect(result.isFatal).toBe(true);
	});
});
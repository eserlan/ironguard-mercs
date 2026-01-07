import { describe, it, expect } from 'vitest';
import { resolveDamage } from './damage';
import { WeaponType } from '../../domain/combat/config';
import { CombatRNG } from './rng';
import { CombatStats } from '../../shared/domain/combat/types';

describe('resolveDamage', () => {
	const weapon = { id: 'test', type: WeaponType.Melee, damage: 100, cooldown: 1, range: 5 };
	const rng = new CombatRNG(1);
	const stats: CombatStats = { baseDamage: 10, synergyMultiplier: 0.5, critChance: 0, critMultiplier: 2.0 };

	it('calculates base damage (Weapon + BaseStats)', () => {
		const result = resolveDamage('p1', 'e1', weapon, stats, false, 0, rng, 500);
		expect(result.amount).toBe(110); // 100 + 10
		expect(result.isFatal).toBe(false);
	});

	it('applies synergy multiplier correctly', () => {
		const result = resolveDamage('p1', 'e1', weapon, stats, true, 0, rng, 500);
		// (100 + 10) * 1.5 = 165
		expect(result.amount).toBe(165);
	});

	it('detects fatal damage correctly', () => {
		const result = resolveDamage('p1', 'e1', weapon, stats, true, 0, rng, 100);
		expect(result.amount).toBe(165);
		expect(result.isFatal).toBe(true);
	});

	it('applies mitigation before fatal check', () => {
		const result = resolveDamage('p1', 'e1', weapon, stats, false, 50, rng, 80);
		// Mitigation = 100 / (100 + 50) = 0.666...
		// 110 * 0.666 = 73
		expect(result.amount).toBe(73);
		expect(result.isFatal).toBe(false); // 73 < 80
	});
});

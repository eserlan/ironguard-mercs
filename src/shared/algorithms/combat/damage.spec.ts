import { describe, it, expect } from 'vitest';
import { resolveDamage } from './damage';
import { calculateAoEMultiplier } from './aoe';
import { WeaponType } from '../../domain/combat/config';
import { CombatRNG } from './rng';
import { CombatStats } from '../../domain/combat/types';

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

	it('reduces damage by 50% when blocking', () => {
		const result = resolveDamage('p1', 'e1', weapon, stats, false, 0, rng, 500, true);
		// 110 * 0.5 = 55
		expect(result.amount).toBe(55);
	});
});

describe('calculateAoEMultiplier', () => {
	it('returns 0 if distance exceeds radius', () => {
		expect(calculateAoEMultiplier(11, 10, false)).toBe(0);
	});

	it('returns 1 if within radius and no falloff', () => {
		expect(calculateAoEMultiplier(5, 10, false)).toBe(1);
	});

	it('calculates linear falloff correctly', () => {
		const radius = 10;
		// At center (distance 0), multiplier should be 1
		expect(calculateAoEMultiplier(0, radius, true)).toBe(1);

		// At half-way (distance 5), multiplier should be 1 - (0.5 * 0.75) = 0.625
		expect(calculateAoEMultiplier(5, radius, true)).toBe(0.625);

		// At edge (distance 10), multiplier should be 1 - (1.0 * 0.75) = 0.25
		expect(calculateAoEMultiplier(10, radius, true)).toBe(0.25);
	});
});
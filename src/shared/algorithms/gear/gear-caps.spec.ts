import { describe, it, expect } from 'vitest';
import { clampGearStat } from './gear-caps';

describe('clampGearStat', () => {
	it('clamps CDR at 40%', () => {
		expect(clampGearStat('CDR', 0.5)).toBe(0.4);
		expect(clampGearStat('CDR', 0.2)).toBe(0.2);
	});

	it('clamps DMG_AMP at 25%', () => {
		expect(clampGearStat('DMG_AMP', 0.3)).toBe(0.25);
	});
});

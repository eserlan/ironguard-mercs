import { describe, it, expect } from 'vitest';
import { getXPThreshold, calculateTeamLevelProgress } from './xp-math';

describe('xp-math', () => {
	it('calculates increasing thresholds', () => {
		expect(getXPThreshold(1)).toBe(1000);
		expect(getXPThreshold(2)).toBe(1200);
	});

	it('signals level up', () => {
		const result = calculateTeamLevelProgress(1000, 1);
		expect(result.levelUp).toBe(true);
	});
});

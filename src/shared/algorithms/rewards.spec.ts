import { describe, it, expect } from 'vitest';
import { calculateRewards } from './rewards';

describe('calculateRewards', () => {
	it('multiplies waves', () => {
		expect(calculateRewards(3)).toBe(300);
	});
});

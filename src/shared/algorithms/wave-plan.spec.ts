import { describe, it, expect } from 'vitest';
import { createWavePlan } from './wave-plan';

describe('createWavePlan', () => {
	it('is deterministic', () => {
		const w1 = createWavePlan(123, 1);
		const w2 = createWavePlan(123, 1);
		expect(w1).toEqual(w2);
	});

	it('scales with difficulty', () => {
		const w1 = createWavePlan(123, 1); // count = 4
		const w2 = createWavePlan(123, 2); // count = 7
		expect(w2[0].enemies.length).toBeGreaterThan(w1[0].enemies.length);
	});
});

import { describe, it, expect } from 'vitest';
import { createWorldPlan } from './world-plan';

describe('createWorldPlan', () => {
	it('is deterministic', () => {
		const plan1 = createWorldPlan(123);
		const plan2 = createWorldPlan(123);
		expect(plan1).toEqual(plan2);
	});

	it('diverges with different seeds', () => {
		const plan1 = createWorldPlan(1);
		const plan2 = createWorldPlan(2);
		expect(plan1.enemySpawns).not.toEqual(plan2.enemySpawns);
	});
});

import { describe, it, expect } from 'vitest';
import { RNG } from './rng';

describe('RNG', () => {
	it('is deterministic', () => {
		const rng1 = new RNG(12345);
		const rng2 = new RNG(12345);
		expect(rng1.next()).toBe(rng2.next());
		expect(rng1.range(1, 100)).toBe(rng2.range(1, 100));
	});

	it('diverges with different seeds', () => {
		const rng1 = new RNG(1);
		const rng2 = new RNG(2);
		expect(rng1.next()).not.toBe(rng2.next());
	});
});

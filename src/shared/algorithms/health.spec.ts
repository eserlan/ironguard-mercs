import { describe, it, expect } from 'vitest';
import { HealthLogic } from './health';

describe('HealthLogic', () => {
	it('takes damage', () => {
		const hp = new HealthLogic(100, 100);
		expect(hp.damage(10)).toBe(false);
		expect(hp.current).toBe(90);
	});

	it('dies at zero', () => {
		const hp = new HealthLogic(10, 100);
		expect(hp.damage(10)).toBe(true);
		expect(hp.current).toBe(0);
	});

	it('clamps at zero', () => {
		const hp = new HealthLogic(10, 100);
		hp.damage(999);
		expect(hp.current).toBe(0);
	});

	it('heals damage', () => {
		const hp = new HealthLogic(50, 100);
		hp.heal(10);
		expect(hp.current).toBe(60);
	});

	it('clamps healing at max', () => {
		const hp = new HealthLogic(90, 100);
		hp.heal(20);
		expect(hp.current).toBe(100);
	});
});

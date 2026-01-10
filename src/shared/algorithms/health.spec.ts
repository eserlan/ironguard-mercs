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

	describe('shield mechanics', () => {
		it('adds shield via addShield method', () => {
			const hp = new HealthLogic(100, 100);
			hp.addShield(50);
			expect(hp.shield).toBe(50);
		});

		it('shield absorbs partial damage', () => {
			const hp = new HealthLogic(100, 100);
			hp.addShield(30);
			expect(hp.damage(20)).toBe(false);
			expect(hp.shield).toBe(10);
			expect(hp.current).toBe(100);
		});

		it('shield absorbs full damage', () => {
			const hp = new HealthLogic(100, 100);
			hp.addShield(50);
			expect(hp.damage(50)).toBe(false);
			expect(hp.shield).toBe(0);
			expect(hp.current).toBe(100);
		});

		it('shield state after taking damage that exceeds shield', () => {
			const hp = new HealthLogic(100, 100);
			hp.addShield(30);
			expect(hp.damage(50)).toBe(false);
			expect(hp.shield).toBe(0);
			expect(hp.current).toBe(80);
		});

		it('damage without shield directly affects health', () => {
			const hp = new HealthLogic(100, 100);
			expect(hp.shield).toBe(0);
			expect(hp.damage(25)).toBe(false);
			expect(hp.current).toBe(75);
		});
	});
});

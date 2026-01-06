import { describe, it, expect, beforeEach } from 'vitest';
import { CooldownManager } from './cooldowns';

describe('CooldownManager', () => {
	let mgr: CooldownManager;

	beforeEach(() => {
		mgr = new CooldownManager();
	});

	it('allows first cast', () => {
		expect(mgr.canCast('test', 5, 100)).toBe(true);
	});

	it('blocks cast during cooldown', () => {
		mgr.setCast('test', 100);
		expect(mgr.canCast('test', 5, 102)).toBe(false);
		expect(mgr.canCast('test', 5, 106)).toBe(true);
	});

	it('calculates remaining time', () => {
		mgr.setCast('test', 100);
		expect(mgr.getRemaining('test', 5, 102)).toBe(3);
		expect(mgr.getRemaining('test', 5, 106)).toBe(0);
	});
});

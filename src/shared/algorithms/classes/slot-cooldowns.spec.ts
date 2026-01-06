import { describe, it, expect, beforeEach } from 'vitest';
import { SlotCooldownManager } from './slot-cooldowns';

describe('SlotCooldownManager', () => {
	let mgr: SlotCooldownManager;

	beforeEach(() => {
		mgr = new SlotCooldownManager();
	});

	it('blocks shared slot', () => {
		mgr.setCooldown('p1', 1, 100, 10); // Slot 1 expires at 110
		expect(mgr.canCast('p1', 1, 105)).toBe(false);
		expect(mgr.canCast('p1', 1, 111)).toBe(true);
	});

	it('does not block other slots', () => {
		mgr.setCooldown('p1', 1, 100, 10);
		expect(mgr.canCast('p1', 2, 105)).toBe(true);
	});
});

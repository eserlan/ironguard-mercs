import { describe, it, expect, beforeEach } from 'vitest';
import { BreakMeterLogic } from './break-logic';

describe('BreakMeterLogic', () => {
	let logic: BreakMeterLogic;

	beforeEach(() => {
		logic = new BreakMeterLogic(100, 10); // threshold 100, decay 10/s
	});

	it('accumulates impact', () => {
		logic.addImpact(50, false);
		expect(logic.getPercent()).toBe(0.5);
	});

	it('requires breaker hit to break at threshold', () => {
		logic.addImpact(100, false);
		expect(logic.getPercent()).toBe(1.0);
		const result = logic.addImpact(10, true);
		expect(result.broken).toBe(true);
	});

	it('decays over time', () => {
		logic.addImpact(50, false);
		logic.update(1); // 1s decay
		expect(logic.getPercent()).toBe(0.4);
	});

	it('manages stagger duration', () => {
		logic.triggerStagger(5);
		expect(logic.isStaggered()).toBe(true);
		logic.update(6);
		expect(logic.isStaggered()).toBe(false);
	});
});

import { describe, it, expect } from 'vitest';
import { evaluateTrigger } from './trigger-eval';

describe('evaluateTrigger', () => {
	it('matches correct event', () => {
		expect(evaluateTrigger('on_block', 'on_block')).toBe(true);
	});

	it('rejects incorrect event', () => {
		expect(evaluateTrigger('on_block', 'on_hit')).toBe(false);
	});
});

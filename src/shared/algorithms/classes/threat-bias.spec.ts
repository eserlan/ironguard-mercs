import { describe, it, expect, beforeEach } from 'vitest';
import { ThreatBiasModel } from './threat-bias';

describe('ThreatBiasModel', () => {
	let model: ThreatBiasModel;

	beforeEach(() => {
		model = new ThreatBiasModel();
	});

	it('adds and expires bias', () => {
		model.addBias('p1', 50, 5, 100);
		expect(model.getBias('p1', 102)).toBe(50);
		expect(model.getBias('p1', 106)).toBe(0);
	});

	it('stacks bias', () => {
		model.addBias('p1', 50, 5, 100);
		model.addBias('p1', 25, 5, 101);
		expect(model.getBias('p1', 102)).toBe(75);
	});
});

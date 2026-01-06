import { describe, it, expect } from 'vitest';
import { AbilityRegistry } from './config';
import { AbilityCategory, ActivationType, TargetingType } from './types';

describe('AbilityConfig', () => {
	it('validates correct config', () => {
		const config = {
			id: 'dash',
			name: 'Dash',
			category: AbilityCategory.Mobility,
			activationType: ActivationType.Instant,
			targeting: TargetingType.Self,
			range: 0,
			variants: {
				top: { cooldown: 5, effectBlocks: [] },
				bottom: { cooldown: 2, effectBlocks: [] },
			},
		};
		expect(AbilityRegistry.validate(config)).toBe(true);
	});
});
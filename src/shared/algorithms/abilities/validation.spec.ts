import { describe, it, expect } from 'vitest';
import { validateAbilityIntent } from './validation';
import { TargetingType, AbilityIntent, AbilityConfig } from '../../domain/abilities/types';

describe('validateAbilityIntent', () => {
	it('accepts valid intent', () => {
		const intent = { timestamp: 100, payload: {} } as unknown as AbilityIntent;
		const config = { targeting: TargetingType.Self } as unknown as AbilityConfig;
		expect(validateAbilityIntent(intent, config, 100.5).valid).toBe(true);
	});

	it('rejects stale intent', () => {
		const intent = { timestamp: 100, payload: {} } as unknown as AbilityIntent;
		const config = { targeting: TargetingType.Self } as unknown as AbilityConfig;
		expect(validateAbilityIntent(intent, config, 105).valid).toBe(false);
	});
});

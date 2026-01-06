import { describe, it, expect } from 'vitest';
import { EnemyRegistry } from './config';
import { EnemyRole, EnemyTier } from './types';

describe('EnemyRegistry', () => {
	it('validates correct config', () => {
		const config = {
			id: 'grunt',
			name: 'Grunt',
			role: EnemyRole.Bruiser,
			tier: EnemyTier.Minion,
			stats: { hp: 100, speed: 16, mitigation: 0, threatBiasMultiplier: 1 },
			moves: [{ id: 'swipe', cooldown: 2 } as any],
			breakThreshold: 50,
		};
		expect(EnemyRegistry.validate(config)).toBe(true);
	});

	it('rejects missing moves', () => {
		const config = { id: 'test', name: 'Test', moves: [], breakThreshold: 10 } as any;
		expect(EnemyRegistry.validate(config)).toBe(false);
	});
});

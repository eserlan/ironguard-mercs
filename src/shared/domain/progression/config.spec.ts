import { describe, it, expect } from 'vitest';
import { PerkRegistry } from './config';
import { PerkType, PerkRarity } from './types';

describe('PerkRegistry', () => {
	it('validates correct perk', () => {
		const perk = {
			id: 'haste',
			name: 'Haste',
			type: PerkType.StatNudge,
			rarity: PerkRarity.Common,
			description: '+10% Speed',
			effects: [{ type: 'StatMod', params: { speed: 1.1 } }],
		};
		expect(PerkRegistry.validate(perk)).toBe(true);
	});

	it('rejects invalid perk', () => {
		const perk = { id: 'test', name: '' } as any;
		expect(PerkRegistry.validate(perk)).toBe(false);
	});
});

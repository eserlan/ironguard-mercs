import { describe, it, expect } from 'vitest';
import { GearRegistry } from './config';
import { EquipmentSlot, GearType, GearRarity } from './types';

describe('GearRegistry', () => {
	it('validates correct gear', () => {
		const item = {
			id: 'iron-sword',
			name: 'Iron Sword',
			slot: EquipmentSlot.Weapon,
			type: GearType.Passive,
			rarity: GearRarity.Common,
			effects: [{ type: 'Damage', params: { amount: 10 } }],
		};
		expect(GearRegistry.validate(item)).toBe(true);
	});

	it('rejects invalid gear', () => {
		const item = { id: 'test', name: '' } as any;
		expect(GearRegistry.validate(item)).toBe(false);
	});
});

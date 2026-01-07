import { describe, it, expect } from 'vitest';
import { canEquip } from './compatibility';
import { EquipmentSlot, GearType, GearRarity } from '../../domain/gear/types';

describe('canEquip', () => {
	const exoticItem = { id: 'e1', rarity: GearRarity.Exotic } as any;
	const commonItem = { id: 'c1', rarity: GearRarity.Common } as any;

	it('allows first exotic', () => {
		expect(canEquip(exoticItem, {}).allowed).toBe(true);
	});

	it('rejects second exotic', () => {
		const current = { [EquipmentSlot.Weapon]: exoticItem };
		expect(canEquip({ id: 'e2', rarity: GearRarity.Exotic } as any, current).allowed).toBe(false);
	});

	it('allows common with exotic', () => {
		const current = { [EquipmentSlot.Weapon]: exoticItem };
		expect(canEquip(commonItem, current).allowed).toBe(true);
	});
});

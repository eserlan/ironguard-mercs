import { describe, it, expect } from 'vitest';
import { validateLoadout } from './loadout-val';
import { ClassRole } from '../../domain/classes/types';

describe('validateLoadout', () => {
	const mockClass = {
		id: 'saint',
		name: 'Saint',
		role: ClassRole.Protector,
		abilityLibrary: ['a1', 'a2'],
		baseStats: {},
	};

	it('accepts valid loadout', () => {
		const loadout = {
			classId: 'saint',
			equippedSlots: [{ slotIndex: 1, abilityId: 'a1' }],
		};
		expect(validateLoadout(loadout, mockClass).valid).toBe(true);
	});

	it('rejects foreign ability', () => {
		const loadout = {
			classId: 'saint',
			equippedSlots: [{ slotIndex: 1, abilityId: 'a3' }],
		};
		expect(validateLoadout(loadout, mockClass).valid).toBe(false);
	});
});

import { describe, it, expect } from 'vitest';
import { PerkRegistry } from './config';
import { PerkType, PerkRarity, RunPerk } from './types';

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
        const perk = { id: 'test', name: '' } as unknown as RunPerk;
        expect(PerkRegistry.validate(perk)).toBe(false);
    });

    it('registers and gets perk', () => {
        const perk = { id: 'reg', name: 'Reg', effects: [1] } as unknown as RunPerk;
        PerkRegistry.register(perk);
        expect(PerkRegistry.get('reg')).toBe(perk);
        expect(PerkRegistry.getAll()).toContain(perk);
    });

    it('throws on duplicate register', () => {
        const perk = { id: 'dup', name: 'Dup', effects: [1] } as unknown as RunPerk;
        PerkRegistry.register(perk);
        expect(() => PerkRegistry.register(perk)).toThrow('Duplicate Perk ID: dup');
    });
});
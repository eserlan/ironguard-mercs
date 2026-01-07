import { describe, it, expect } from 'vitest';
import { resolveMissionDeath } from './permadeath';
import { Roster, Mercenary } from '../domain/roster';

describe('Permadeath Algorithms', () => {
    const mockMerc: Mercenary = {
        id: "m1",
        name: "Test",
        className: "Warrior",
        level: 1,
        xp: 0,
        curHealth: 100,
        equippedGear: []
    };

    const mockRoster: Roster = {
        playerId: "p1",
        capacity: 5,
        mercenaries: [mockMerc],
        currency: new Map()
    };

    it('should NOT remove mercenary in Standard mode', () => {
        const result = resolveMissionDeath(mockRoster, "m1", "Standard");
        expect(result.mercenaries.length).toBe(1);
    });

    it('should remove mercenary in Ironman mode', () => {
        const result = resolveMissionDeath(mockRoster, "m1", "Ironman");
        expect(result.mercenaries.length).toBe(0);
    });
});

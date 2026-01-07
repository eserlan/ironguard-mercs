import { describe, it, expect } from 'vitest';
import { Roster, Mercenary } from './roster';

describe('Roster Domain', () => {
    it('should be able to create a valid roster structure', () => {
        const merc: Mercenary = {
            id: "m1",
            name: "Ghost",
            className: "Scout",
            level: 1,
            xp: 0,
            curHealth: 100,
            equippedGear: []
        };

        const roster: Roster = {
            playerId: "p1",
            capacity: 5,
            mercenaries: [merc],
            currency: new Map([["Gold", 100]])
        };

        expect(roster.mercenaries.length).toBe(1);
        expect(roster.currency.get("Gold")).toBe(100);
    });
});

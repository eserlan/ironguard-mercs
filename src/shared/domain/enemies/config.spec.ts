import { describe, it, expect } from 'vitest';
import { EnemyRegistry, EnemyArchetype } from './config';
import { EnemyRole, EnemyTier, MoveConfig } from './types';

describe('EnemyRegistry', () => {
    it('validates correct config', () => {
        const config = {
            id: 'grunt',
            name: 'Grunt',
            role: EnemyRole.Bruiser,
            tier: EnemyTier.Minion,
            stats: { hp: 100, speed: 16, mitigation: 0, threatBiasMultiplier: 1 },
            moves: [{ id: 'swipe', cooldown: 2 } as unknown as MoveConfig],
            breakThreshold: 50,
        } as unknown as EnemyArchetype;
        expect(EnemyRegistry.validate(config)).toBe(true);
    });

    it('rejects missing moves', () => {
        const config = { id: 'test', name: 'Test', moves: [], breakThreshold: 10 } as unknown as EnemyArchetype;
        expect(EnemyRegistry.validate(config)).toBe(false);
    });

    it('registers and gets', () => {
        const config = {
            id: 'e1', name: 'E1', moves: [1], breakThreshold: 10
        } as unknown as EnemyArchetype;
        EnemyRegistry.register(config);
        expect(EnemyRegistry.get('e1')).toBe(config);
    });

    it('throws on duplicate', () => {
        const config = { id: 'e2', name: 'E2', moves: [1], breakThreshold: 10 } as unknown as EnemyArchetype;
        EnemyRegistry.register(config);
        expect(() => EnemyRegistry.register(config)).toThrow('Duplicate enemy ID: e2');
    });
});
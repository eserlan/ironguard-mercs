import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EffectBlock, EffectType } from '../../shared/domain/abilities/types';

// Mock Flamework before importing service
// vi.mock removed (handled by alias)

import { EffectService } from './EffectService';
import { StandardEffects } from '../components/abilities/StandardEffects';

// Mock dependencies
const mockCombatService = {
    getRng: vi.fn().mockReturnValue({}),
} as any;

const mockComponents = {
    getComponent: vi.fn(),
} as any;

describe('EffectService', () => {
    let service: EffectService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new EffectService(mockCombatService, mockComponents);

        // Spy on StandardEffects static methods
        vi.spyOn(StandardEffects, 'applyDamage').mockImplementation(() => { });
        vi.spyOn(StandardEffects, 'applyHeal').mockImplementation(() => { });
    });

    it('routes Damage effects to StandardEffects.applyDamage', () => {
        const block: EffectBlock = { type: EffectType.Damage, value: 50 };
        const target = { Name: 'Target' } as unknown as Instance;

        service.resolveEffect(target, block, 'attacker-id');

        expect(StandardEffects.applyDamage).toHaveBeenCalledWith(
            target,
            block,
            'attacker-id',
            mockCombatService,
            mockComponents,
            expect.anything()
        );
    });

    it('routes Heal effects to StandardEffects.applyHeal', () => {
        const block: EffectBlock = { type: EffectType.Heal, value: 20 };
        const target = { Name: 'Ally' } as unknown as Instance;

        service.resolveEffect(target, block, 'healer-id');

        expect(StandardEffects.applyHeal).toHaveBeenCalledWith(
            target,
            block,
            mockComponents
        );
    });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { EnemyAIStateMachine } from './ai-state';
import { AIPhase } from '../../domain/enemies/types';

describe('EnemyAIStateMachine', () => {
    let fsm: EnemyAIStateMachine;

    beforeEach(() => {
        fsm = new EnemyAIStateMachine();
    });

    it('starts in Idle', () => {
        expect(fsm.getPhase()).toBe(AIPhase.Idle);
    });

    it('allows valid sequence', () => {
        expect(fsm.transition(AIPhase.Engage)).toBe(true);
        expect(fsm.transition(AIPhase.Pressure)).toBe(true);
        expect(fsm.transition(AIPhase.Recover)).toBe(true);
        expect(fsm.transition(AIPhase.Reposition)).toBe(true);
        expect(fsm.transition(AIPhase.Engage)).toBe(true);
    });

    it('allows Engage to Idle', () => {
        fsm.transition(AIPhase.Engage);
        expect(fsm.transition(AIPhase.Idle)).toBe(true);
    });

    it('allows Pressure to Reposition', () => {
        fsm.transition(AIPhase.Engage);
        fsm.transition(AIPhase.Pressure);
        expect(fsm.transition(AIPhase.Reposition)).toBe(true);
    });

    it('allows Recover to Idle or Reposition', () => {
        fsm.transition(AIPhase.Engage);
        fsm.transition(AIPhase.Pressure);
        fsm.transition(AIPhase.Recover);
        const fsm2 = new EnemyAIStateMachine();
        fsm2.transition(AIPhase.Engage);
        fsm2.transition(AIPhase.Pressure);
        fsm2.transition(AIPhase.Recover);
        
        expect(fsm.transition(AIPhase.Idle)).toBe(true);
        expect(fsm2.transition(AIPhase.Reposition)).toBe(true);
    });

    it('rejects illegal jumps', () => {
        expect(fsm.transition(AIPhase.Pressure)).toBe(false);
    });

    it('rejects same state transition', () => {
        expect(fsm.transition(AIPhase.Idle)).toBe(false);
    });
});
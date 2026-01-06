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

	it('allows valid transitions', () => {
		expect(fsm.transition(AIPhase.Engage)).toBe(true);
		expect(fsm.transition(AIPhase.Pressure)).toBe(true);
		expect(fsm.transition(AIPhase.Recover)).toBe(true);
	});

	it('rejects illegal jumps', () => {
		expect(fsm.transition(AIPhase.Pressure)).toBe(false);
	});
});

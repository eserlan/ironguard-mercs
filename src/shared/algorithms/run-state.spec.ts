import { describe, it, expect, beforeEach } from 'vitest';
import { RunStateMachine } from './run-state';
import { MatchPhase } from '../domain/run';

describe('RunStateMachine', () => {
    let fsm: RunStateMachine;

    beforeEach(() => {
        fsm = new RunStateMachine({
            seed: 123,
            mode: "ArenaClear",
            missionMode: "Standard",
            difficulty: 1,
        });
    });

    it('starts in Lobby', () => {
        expect(fsm.getState().phase).toBe(MatchPhase.Lobby);
    });

    it('allows valid sequence', () => {
        expect(fsm.transition(MatchPhase.Generating)).toBe(true);
        expect(fsm.transition(MatchPhase.Spawning)).toBe(true);
        expect(fsm.transition(MatchPhase.Playing)).toBe(true);
        expect(fsm.transition(MatchPhase.Ending)).toBe(true);
        expect(fsm.transition(MatchPhase.Results)).toBe(true);
        expect(fsm.transition(MatchPhase.Lobby)).toBe(true);
    });

    it('rejects invalid jump', () => {
        expect(fsm.transition(MatchPhase.Playing)).toBe(false); // Can't jump from Lobby to Playing
    });
});

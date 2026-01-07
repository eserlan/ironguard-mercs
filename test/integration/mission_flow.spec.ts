import { describe, it, expect } from 'vitest';
import { RunStateMachine } from '../../src/shared/algorithms/run-state';
import { MatchPhase, RunConfig } from '../../src/shared/domain/run';

describe('Mission Lifecycle Integration', () => {
    const config: RunConfig = {
        seed: 42,
        mode: "ArenaClear",
        missionMode: "Standard",
        difficulty: 1
    };

    it('should complete a full successful run from Lobby to Results', () => {
        const fsm = new RunStateMachine(config);
        
        // 1. Start from Lobby
        expect(fsm.getState().phase).toBe(MatchPhase.Lobby);
        
        // 2. Begin Generation
        expect(fsm.transition(MatchPhase.Generating)).toBe(true);
        
        // 3. Move to Spawning
        expect(fsm.transition(MatchPhase.Spawning)).toBe(true);
        
        // 4. Start Gameplay
        expect(fsm.transition(MatchPhase.Playing)).toBe(true);
        expect(fsm.getState().startTime).toBeGreaterThan(0);
        
        // 5. Complete Mission (Enemies cleared)
        expect(fsm.transition(MatchPhase.Ending)).toBe(true);
        
        // 6. Show Results
        expect(fsm.transition(MatchPhase.Results)).toBe(true);
        
        // 7. Return to Lobby
        expect(fsm.transition(MatchPhase.Lobby)).toBe(true);
        expect(fsm.getState().phase).toBe(MatchPhase.Lobby);
    });

    it('should block invalid transitions (e.g. Lobby -> Playing)', () => {
        const fsm = new RunStateMachine(config);
        expect(fsm.transition(MatchPhase.Playing)).toBe(false);
        expect(fsm.getState().phase).toBe(MatchPhase.Lobby);
    });
});

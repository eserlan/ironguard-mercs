import { describe, it, expect } from 'vitest';
import { simulateStatus } from './status-sim';

describe('simulateStatus', () => {
    it('expires correctly', () => {
        const status = { config: { id: 'burn', duration: 5 }, startTime: 0 };
        expect(simulateStatus(status, 4).expired).toBe(false);
        expect(simulateStatus(status, 6).expired).toBe(true);
    });

    it('triggers ticks for Scorch at correct intervals', () => {
        const status = { 
            config: { id: 'scorch', duration: 10, tickInterval: 2 }, 
            startTime: 0,
            nextTick: 2
        };

        // At t=1, no tick
        let result = simulateStatus(status, 1);
        expect(result.tick).toBe(false);
        
        // At t=2, tick triggers
        result = simulateStatus(status, 2);
        expect(result.tick).toBe(true);
        expect(status.nextTick).toBe(4);

        // At t=3, no tick
        result = simulateStatus(status, 3);
        expect(result.tick).toBe(false);

        // At t=4.5, tick triggers
        result = simulateStatus(status, 4.5);
        expect(result.tick).toBe(true);
        expect(status.nextTick).toBe(6);
    });
});

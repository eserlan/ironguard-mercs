import { describe, it, expect, vi } from 'vitest';
import { logTelemetry, logEnemyDeath, logInterrupt, logPerkChoice, logSlowTrigger } from './telemetry';

describe('Telemetry', () => {
    it('logs basic telemetry', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        logTelemetry('test');
        // print() in setup.ts maps to console.log
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('logs specific events', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        logEnemyDeath('e1', 'p1', 'r1');
        logInterrupt('e1', 'a1', true);
        logPerkChoice(1, 'p1', false);
        logSlowTrigger(1);
        expect(spy).toHaveBeenCalledTimes(4);
        spy.mockRestore();
    });
});

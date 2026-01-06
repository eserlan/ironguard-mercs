import { describe, it, expect } from 'vitest';
import { simulateStatus } from './status-sim';

describe('simulateStatus', () => {
    it('expires correctly', () => {
        const status = { config: { id: 'burn', duration: 5 }, startTime: 0 };
        expect(simulateStatus(status, 4).expired).toBe(false);
        expect(simulateStatus(status, 6).expired).toBe(true);
    });
});

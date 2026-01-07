import { describe, it, expect } from 'vitest';
import { calculateMissionRewards } from './rewards';

describe('Mission Rewards Algorithms', () => {
    it('should return base rewards in Standard mode', () => {
        const rewards = calculateMissionRewards(100, 200, "Standard");
        expect(rewards.gold).toBe(100);
        expect(rewards.xp).toBe(200);
    });

    it('should apply 50% bonus in Ironman mode', () => {
        const rewards = calculateMissionRewards(100, 200, "Ironman");
        expect(rewards.gold).toBe(150);
        expect(rewards.xp).toBe(300);
    });
});
import { describe, it, expect } from 'vitest';
import { calculateTargetScore } from './target-scoring';
import { EnemyRole } from '../../domain/enemies/types';

describe('calculateTargetScore', () => {
	it('Assassin prefers isolated targets', () => {
		const isolated = { id: 'p1', distance: 30, threatBias: 0, isIsolated: true, isLowHp: false };
		const group = { id: 'p2', distance: 30, threatBias: 0, isIsolated: false, isLowHp: false };
		
		const s1 = calculateTargetScore(EnemyRole.Assassin, isolated);
		const s2 = calculateTargetScore(EnemyRole.Assassin, group);
		expect(s1).toBeGreaterThan(s2);
	});

	it('Bias increases score', () => {
		const lowBias = { id: 'p1', distance: 10, threatBias: 10, isIsolated: false, isLowHp: false };
		const highBias = { id: 'p1', distance: 10, threatBias: 50, isIsolated: false, isLowHp: false };
		
		const s1 = calculateTargetScore(EnemyRole.Bruiser, lowBias);
		const s2 = calculateTargetScore(EnemyRole.Bruiser, highBias);
		expect(s2).toBeGreaterThan(s1);
	});
});

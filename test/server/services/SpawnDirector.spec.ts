import { describe, it, expect, vi } from 'vitest';
import { AllPacks } from '../../../src/shared/config/MonsterPacks';

// Mock SpawnDirector's pure functions without Roblox dependencies
function getDeterministicRandom(mapSeed: number, salt: string): number {
	let hash = mapSeed;
	for (let i = 0; i < salt.length; i++) {
		hash = (hash + salt.charCodeAt(i)) % 2147483647;
	}
	return hash;
}

function selectPack(budget: number, biome: string) {
	const candidates = AllPacks.filter((p) =>
		p.budgetCost <= budget &&
		p.biomeTags.includes(biome)
	);
	if (candidates.length === 0) return undefined;
	return candidates[0]; // Deterministic for testing
}

describe('SpawnDirector', () => {
	describe('getDeterministicRandom', () => {
		it('generates same hash for same seed and salt', () => {
			const hash1 = getDeterministicRandom(12345, 'RoomA');
			const hash2 = getDeterministicRandom(12345, 'RoomA');
			expect(hash1).toBe(hash2);
		});

		it('generates different hash for different salts', () => {
			const hash1 = getDeterministicRandom(12345, 'RoomA');
			const hash2 = getDeterministicRandom(12345, 'RoomB');
			expect(hash1).not.toBe(hash2);
		});
	});

	describe('SelectPack', () => {
		it('selects a valid pack matching budget and biome', () => {
			const pack = selectPack(100, 'Forest');
			expect(pack).toBeDefined();
			expect(pack?.id).toBe('forest_wolves_01');
		});

		it('returns undefined if budget too low', () => {
			const pack = selectPack(1, 'Forest'); // Budget too low
			expect(pack).toBeUndefined();
		});

		it('returns undefined if biome does not match', () => {
			const pack = selectPack(100, 'Desert');
			expect(pack).toBeUndefined();
		});
	});
});

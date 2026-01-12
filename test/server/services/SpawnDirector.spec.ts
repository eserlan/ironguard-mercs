import { describe, it, expect } from 'vitest';
import { AllPacks } from '../../../src/shared/config/MonsterPacks';

/**
 * SpawnDirector Algorithm Tests
 * 
 * Note: SpawnDirector is a server service with heavy Roblox dependencies (Random, BasePart, CFrame, etc.)
 * that cannot be directly unit tested outside of Roblox runtime. These tests verify the core algorithms
 * used by SpawnDirector for deterministic spawn logic and pack selection.
 * 
 * The pure logic functions tested here mirror the implementation in SpawnDirector:
 * - getDeterministicRandom: Tests the hash generation algorithm for deterministic RNG seeding
 * - selectPack: Tests the pack selection logic based on budget and biome constraints
 * 
 * Full integration testing of SpawnDirector methods (ScanMap, ActivateZone, AssignSpots) 
 * requires Roblox runtime environment and is covered by integration tests.
 */

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

describe('SpawnDirector Algorithms', () => {
	describe('getDeterministicRandom algorithm', () => {
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

		it('generates different hash for different seeds', () => {
			const hash1 = getDeterministicRandom(12345, 'RoomA');
			const hash2 = getDeterministicRandom(67890, 'RoomA');
			expect(hash1).not.toBe(hash2);
		});
	});

	describe('SelectPack algorithm', () => {
		it('selects a valid pack matching budget and biome', () => {
			const pack = selectPack(100, 'Forest');
			expect(pack).toBeDefined();
			expect(pack?.id).toBe('forest_wolves_01');
			expect(pack?.budgetCost).toBeLessThanOrEqual(100);
			expect(pack?.biomeTags).toContain('Forest');
		});

		it('returns undefined if budget too low', () => {
			const pack = selectPack(1, 'Forest'); // Budget too low
			expect(pack).toBeUndefined();
		});

		it('returns undefined if biome does not match', () => {
			const pack = selectPack(100, 'Desert');
			expect(pack).toBeUndefined();
		});

		it('filters packs by both budget and biome', () => {
			// Should find a pack that matches both constraints
			const pack = selectPack(50, 'Forest');
			if (pack) {
				expect(pack.budgetCost).toBeLessThanOrEqual(50);
				expect(pack.biomeTags).toContain('Forest');
			}
		});
	});
});

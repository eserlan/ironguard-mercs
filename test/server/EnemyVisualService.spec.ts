import { describe, it, expect, beforeEach } from 'vitest';
import { EnemyVisualService } from "server/services/EnemyVisualService";
import { VisualProfiles } from "shared/domain/enemies/visual-profiles";
import { EnemyArchetype } from "shared/domain/enemies/config";
import { EnemyRole, EnemyTier } from "shared/domain/enemies/enemy-types";

describe("EnemyVisualService", () => {
	let service: EnemyVisualService;

	beforeEach(() => {
		service = new EnemyVisualService();
	});

	it("should resolve a profile key to a visual profile", () => {
		const profileKey = "Slasher";
		const profile = VisualProfiles[profileKey];
		expect(profile).toBeDefined();
		expect(Array.isArray(profile.assetIds)).toBe(true);
	});

	it("should not throw when setting up visuals for a valid rig", () => {
		const rig = new Instance("Model");
		const humanoid = new Instance("Humanoid");
		humanoid.Parent = rig;

		const mockArchetype: EnemyArchetype = {
			id: "test-enemy",
			name: "Test Enemy",
			role: EnemyRole.Bruiser,
			tier: EnemyTier.Minion,
			stats: { hp: 100, speed: 10, mitigation: 0, threatBiasMultiplier: 1 },
			moves: [{ id: 'test', cooldown: 1 }],
			breakThreshold: 10,
			visual: {
				rigType: "R15",
				profileKey: "Slasher",
			},
		} as unknown as EnemyArchetype;

		// Mock ApplyDescription to avoid external dependencies in unit test
		(humanoid as any).ApplyDescription = () => { };

		expect(() => service.setupEnemyVisuals(rig, mockArchetype)).not.toThrow();
	});
});

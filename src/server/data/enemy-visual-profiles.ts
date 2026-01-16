import { EnemyVisualProfile } from "shared/domain/enemies/visual-types";

export const VisualProfiles: Record<string, EnemyVisualProfile> = {
	Slasher: {
		assetIds: [], // Removed misaligned R15 accessories from blocky constructs
		bodyColors: {
			torso: Color3.fromRGB(80, 80, 80), // Stealthy grey
			head: Color3.fromRGB(40, 40, 40),
			leftArm: Color3.fromRGB(60, 60, 60),
			rightArm: Color3.fromRGB(60, 60, 60),
		},
		scale: {
			height: 1.0,
			width: 0.9,
			depth: 0.9,
		},
		eyeColor: Color3.fromRGB(200, 50, 50), // Red eyes for grunts
	},
	Guard: {
		assetIds: [],
		bodyColors: {
			torso: Color3.fromRGB(40, 40, 100), // Blue-ish tint for protectors
			head: Color3.fromRGB(40, 40, 40),
		},
		scale: {
			width: 1.2,
			depth: 1.2,
		},
	},
	Giant: {
		assetIds: [],
		bodyColors: {
			torso: Color3.fromRGB(100, 20, 20), // Dark red elite tint
			head: Color3.fromRGB(40, 40, 40),
		},
		scale: {
			height: 1.8,
			width: 1.6,
			depth: 1.6,
		},
		eyeColor: Color3.fromRGB(255, 0, 0),
	},
};

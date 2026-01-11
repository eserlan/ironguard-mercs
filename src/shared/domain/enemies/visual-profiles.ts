import { EnemyVisualProfile } from "./visual-types";

export const VisualProfiles: Record<string, EnemyVisualProfile> = {
	Slasher: {
		assetIds: [
			11750247076, // Mask
			14562080352, // Shoulder
		],
		bodyColors: {
			torso: Color3.fromRGB(80, 40, 40),
			head: Color3.fromRGB(40, 40, 40),
		},
		scale: {
			height: 1.1,
		},
	},
	Guard: {
		assetIds: [
			11438258327, // Hood
		],
		bodyColors: {
			torso: Color3.fromRGB(40, 60, 80),
		},
		scale: {
			width: 1.2,
		},
	},
	Giant: {
		assetIds: [],
		bodyColors: {
			torso: Color3.fromRGB(100, 0, 0),
		},
		scale: {
			height: 1.5,
			width: 1.5,
			depth: 1.5,
		},
	},
};
export interface EnemyVisualProfile {
	/** List of Catalog Asset IDs (Hats, Shoulders, Face, etc.) */
	assetIds: number[];

	/** Optional Shirt Template ID */
	shirtTemplateId?: number;

	/** Optional Pants Template ID */
	pantsTemplateId?: number;

	/** Body Color Overrides */
	bodyColors?: {
		head?: Color3;
		torso?: Color3;
		leftArm?: Color3;
		rightArm?: Color3;
		leftLeg?: Color3;
		rightLeg?: Color3;
	};

	/** Scale Factors (Default: 1.0) */
	scale?: {
		height?: number;
		width?: number;
		depth?: number;
		head?: number;
	};
}

export interface EnemyVisualConfig {
	readonly rigType: "R15";
	/** Key referencing a profile in the VisualProfiles registry */
	readonly profileKey: string;
	/** Key referencing a model in ServerStorage/Weapons */
	readonly weaponKey?: string;
	/** Key referencing an animation set (existing system) */
	readonly animationSetKey?: string;
}
export interface ClassRecord {
	readonly Level: number;
	readonly XP: number;
	readonly Loadout: string[];
}

export interface PlayerProfile {
	readonly SchemaVersion: number;
	readonly FirstSeen: number;
	readonly LastPlayed: number;
	readonly Global: {
		readonly LastSelectedClassId: string;
	};
	readonly Classes: { [key: string]: ClassRecord };
}

// Default values for new profiles
export const DEFAULT_PROFILE: PlayerProfile = {
	SchemaVersion: 1,
	FirstSeen: 0,
	LastPlayed: 0,
	Global: {
		LastSelectedClassId: "shield-saint", // Default starter
	},
	Classes: {}, // Populated on demand
};

export const DEFAULT_CLASS_RECORD: ClassRecord = {
	Level: 1,
	XP: 0,
	Loadout: [], // Empty loadout initially
};

// Shared interfaces for Monster Spawning System

/** Plain TS alternative to Roblox's NumberRange for Vitest compatibility */
export interface CountRange {
	readonly Min: number;
	readonly Max: number;
}

export interface PackMemberDef {
	readonly enemyId: string;
	readonly role: "Minion" | "Elite" | "Boss";
	readonly count: CountRange;
	readonly preferredSpotType?: "Melee" | "Ranged";
}

export interface MonsterPackDef {
	readonly id: string;
	readonly budgetCost: number;
	readonly minSize: number;
	readonly biomeTags: string[];
	readonly members: PackMemberDef[];
}

export interface SpawnNodeMetadata {
	readonly roomId: string;
	readonly spotType: "Melee" | "Ranged" | "Boss";
	readonly tier: "Minion" | "Elite";
	readonly isAmbush: boolean;
}

export interface EncounterZoneState {
	readonly zoneId: string;
	readonly status: "Dormant" | "Active" | "Cleared";
	readonly activeEnemies: Set<string>; // GUIDs
	readonly totalWaves: number;
	readonly currentWave: number;
}

export interface SpawningEnemy {
	readonly guid: string;
	readonly packId: string;
	readonly state: "Spawning" | "Idle" | "Combat" | "Dead";
	readonly spawnTime: number;
}

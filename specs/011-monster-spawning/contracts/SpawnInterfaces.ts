// Shared interfaces for Monster Spawning System

export interface NumberRange {
    Min: number;
    Max: number;
}

export interface PackMemberDef {
    readonly enemyId: string;
    readonly role: "Minion" | "Elite" | "Boss";
    readonly count: NumberRange;
    readonly preferredSpotType?: "Melee" | "Ranged";
}

export interface MonsterPackDef {
    readonly id: string;
    readonly budgetCost: number;
    readonly minSize: number;
    readonly biomeTags: string[];
    readonly members: PackMemberDef[];
}

export interface SpawnRequest {
    readonly roomId: string;
    readonly budget: number;
    readonly biome: string;
    readonly seed: number; // For deterministic selection
}

export interface ZoneStatus {
    readonly zoneId: string;
    readonly activeEnemies: number;
    readonly isCleared: boolean;
}

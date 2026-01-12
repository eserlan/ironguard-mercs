# Data Model: Monster Spawning

## Core Entities

### 1. Monster Pack Definition
Static configuration defining a group of enemies.

```typescript
interface MonsterPackDef {
    readonly id: string;
    readonly budgetCost: number; // Difficulty cost
    readonly minSize: number;
    readonly biomeTags: string[]; // e.g., ["Forest", "Dungeon"]
    readonly members: PackMemberDef[];
}

interface PackMemberDef {
    readonly enemyId: string; // e.g., "Goblin_Skirmisher"
    readonly role: "Minion" | "Elite" | "Boss";
    readonly count: NumberRange; // e.g., "2-4" (parsed to min/max)
    readonly preferredSpotType?: "Melee" | "Ranged"; // Matches SpawnNode metadata
}
```

### 2. Spawn Node (Metadata)
Data extracted from the `EnemySpot` parts in the dungeon map.

```typescript
interface SpawnNode {
    readonly cframe: CFrame;
    readonly roomId: string;
    readonly spotType: "Melee" | "Ranged" | "Boss";
    readonly isAmbush: boolean;
    readonly occupiedBy?: string; // Enemy GUID if spawned
}
```

### 3. Encounter Zone (Runtime)
Represents a logical room and its active enemies.

```typescript
interface EncounterZoneState {
    readonly zoneId: string;
    readonly status: "Dormant" | "Active" | "Cleared";
    readonly activeEnemies: Set<string>; // GUIDs
    readonly totalWaves: number;
    readonly currentWave: number;
}
```

### 4. Enemy Runtime Instance
The runtime representation of a spawned monster (bridging 011 and 006).

```typescript
interface SpawningEnemy {
    readonly guid: string;
    readonly packId: string;
    readonly state: "Spawning" | "Idle" | "Combat" | "Dead";
    readonly spawnTime: number; // For sync with client VFX
}
```

## Relationships

- **SpawnDirector** 1--* **EncounterZone** (Director manages all zones)
- **EncounterZone** 1--* **MonsterPack** (A zone can have multiple packs, e.g. waves)
- **MonsterPack** 1--* **EnemyEntity** (Pack spawns multiple enemies)
- **PackRegistry** (Lookup for all MonsterPackDefs)

## Persistence

- **None**: This is a runtime-only system.
- **State**: Reconstructed from Dungeon Seed (determinism) + Current Runtime State.

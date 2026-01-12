# Data Model: Save Player Progression

**Feature**: `012-save-player-progression`

## Entities

### PlayerProfile (Persistent Storage)
The root document stored in `DataStoreService`.

| Field | Type | Description |
|-------|------|-------------|
| `SchemaVersion` | `number` | Version of the data structure (initially 1). |
| `FirstSeen` | `number` | Timestamp (os.time) of first profile creation. |
| `LastPlayed` | `number` | Timestamp (os.time) of last save. |
| `Global` | `GlobalState` | Data not tied to a specific class. |
| `Classes` | `Map<string, ClassRecord>` | Dictionary of class progress, keyed by `ClassId`. |

### GlobalState
| Field | Type | Description |
|-------|------|-------------|
| `LastSelectedClassId` | `string` | The ID of the class the player was using last session. |

### ClassRecord
| Field | Type | Description |
|-------|------|-------------|
| `Level` | `number` | Current level (e.g., 1-20). Default: 1. |
| `XP` | `number` | Current experience points. Default: 0. |
| `Loadout` | `string[]` | List of 4 `AbilityId` strings currently equipped. |

## Relationships

- **User** (Roblox Player) has exactly **1 PlayerProfile**.
- **PlayerProfile** has **N ClassRecords** (one for each class archetype in the game).

## Constraints

- `Loadout` must contain exactly 4 entries (can be empty strings or "None" if slots are empty, but array size is fixed or capped).
- `Level` min 1, max [Configurable].
- `XP` non-negative.

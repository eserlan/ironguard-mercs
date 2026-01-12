# Research: Save Player Progression

**Feature**: `012-save-player-progression`
**Date**: 2026-01-12

## Decision Log

### 1. Storage Backend
- **Decision**: Use Roblox `DataStoreService` directly with a custom `DataService` wrapper.
- **Rationale**: 
  - Keeps external dependencies low (avoiding package management overhead for a single feature).
  - Allows full control over the session locking logic fitting the specific needs (Multi-class profile).
  - Sufficient for the scale defined in requirements.
- **Alternatives Considered**: 
  - `@rbxts/profileservice`: Industry standard, but adds dependency complexity. Rejected for this specific iteration to maintain self-contained "Runtime generation".
  - `MockDataStore`: Only for testing.

### 2. Session Locking Strategy
- **Decision**: Implement Optimistic Concurrency Control using `UpdateAsync`.
- **Mechanism**:
  - Each server generates a unique `SessionId` (GUID) for the player upon join.
  - DataStore entry includes `ActiveSessionId` and `LastUpdateTimestamp`.
  - On Save: `UpdateAsync` checks if `ActiveSessionId` matches the server's ID. If not, the save is rejected (preventing overwrite from an old server).
  - On Load: Force-claim the session by updating `ActiveSessionId` to the current server's ID.

### 3. Data Structure & Schema
- **Decision**: Single Document per Player containing all Class Data.
- **Structure**:
  ```typescript
  interface PlayerProfile {
      SchemaVersion: number;
      Global: {
          LastClassId: string;
      };
      Classes: {
          [ClassId: string]: {
              Level: number;
              XP: number;
              Loadout: string[]; // Ability IDs
          }
      };
  }
  ```
- **Rationale**: "One Profile per Class" model means we need a map of classes. Loading all data at once is efficient (1 request) and atomic.

### 4. Serialization
- **Decision**: Store String IDs.
- **Rationale**: `AbilityId` and `ClassId` are stable string identifiers defined in static config (`src/shared/data/...`). Runtime objects are reconstructed from these IDs.

### 5. Autosave Interval
- **Decision**: 5 Minutes.
- **Rationale**: Balances data safety with DataStore write limits (60 + NumPlayers * 10 per minute). 5 minutes is well within safe limits.

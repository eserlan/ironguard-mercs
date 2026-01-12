# Monster Spawning & Encounter Design

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-11
**Feature Branch**: `011-monster-spawning`
**Input**: User description: "Define monster spawning logic, encounter design, and placement systems."

## Clarifications

### Session 2026-01-11
- Q: How do "Ambush" enemies appear? → A: **VFX Transition** (Option B). They play a cue (burrow, portal) to mask instantiation and telegraph threat.
- Q: Is enemy selection deterministic? → A: **Fully Deterministic** (Option A). Same Dungeon Seed = Same Layout AND Same Enemies.
- Q: How does aggro spread? → A: **Pack Linking** (Option A). Engaging one enemy alerts its entire defined Pack instantly.
- Q: How does difficulty scale? → A: **Stats Only** (Option A). Multipliers on HP/Damage; no composition changes in MVP.
- Q: Do enemies respawn in cleared rooms? → A: **Never** (Option A). Cleared rooms remain safe.

## Summary

This feature bridges the gap between **Dungeon Generation (004)** and **Monster Concepts (006)**. It defines how enemies are selected, placed, and activated within the game world. It introduces the **Encounter Director**, a system responsible for populating the dungeon with balanced "Packs" of enemies based on difficulty, biome, and room topology, ensuring a paced and tactical combat experience.

## Problem / Why

Currently, we have a way to generate maps and a design for enemies, but no system to place them intelligently. Purely random placement leads to unfair spikes (e.g., 5 Elites in a closet) or boring lulls. We need a system that understands "pacing" and "composition" to create memorable combat encounters that scale with player progression.

## Proposal / What

We will implement a structured **Spawning System** that operates in two phases: **Generation Phase** (Population) and **Runtime Phase** (Activation).

### Core Concepts

1.  **Monster Packs**:
    *   Enemies are never spawned individually; they are spawned in **Packs**.
    *   A Pack is a predefined composition (e.g., "Goblin Scouting Party": 3x Skirmisher (Minion), 1x Shaman (Elite)).
    *   Packs have size ratings (Small, Medium, Large) to fit different room sizes.
    *   **Pack Linking**: All members of a pack share an aggro state. If one is pulled, all are alerted.

2.  **Spawn Nodes (from Map)**:
    *   The Dungeon Generator places `EnemySpot` attachments in tiles.
    *   These nodes have metadata: `Type` (Melee, Ranged, Boss), `Tier` (Minion, Elite), and `Ambush` (boolean).
    *   The Spawner matches Pack members to appropriate Nodes.

3.  **Encounter Zones**:
    *   A "Room" or logical segment of the dungeon is an **Encounter Zone**.
    *   Zones can be **Active** (players fighting), **Dormant** (waiting), or **Cleared**.
    *   **No Respawn**: Once a Zone is cleared, it remains safe for the duration of the run.
    *   **Door Locking**: Some encounters ("Arenas") lock doors until the zone is Cleared.

### User Scenarios & Testing

#### User Story 1 - Populate Room (Priority: P1)
**Description**: When a dungeon is generated, the system populates rooms with appropriate Monster Packs.
**Value**: Ensures the map has content.
**Independent Test**: Generate a dungeon. Inspect the workspace. Verify `EnemySpot` nodes are populated with Enemy Models (or placeholders) matching the biome.

#### User Story 2 - Activation & Aggro (Priority: P1)
**Description**: Enemies in a Dormant room do not consume CPU (or minimal). When players enter the Zone (or open the door), enemies "Wake Up" and assess targets.
**Value**: Performance and preventing cross-room aggro trains.
**Independent Test**: Place a player outside a room. Verify enemies are idle. Enter room. Verify enemies enter `Engage` state.

#### User Story 3 - Wave Spawning (Priority: P2)
**Description**: For "Arena" events, enemies spawn in timed waves rather than all at once.
**Value**: Pacing for high-intensity moments.
**Independent Test**: Trigger an Arena event. Kill Wave 1. Verify Wave 2 spawns after X seconds or Y% kills.

### Requirements

#### Functional
- **FR-001**: System MUST support **Pack Definitions** (groups of enemies that spawn together).
- **FR-002**: System MUST place packs into rooms by matching `EnemySpot` capacity to Pack size.
- **FR-003**: System MUST prevent "Clown Car" spawns (enemies overlapping or spawning inside walls) by validating Node clearance.
- **FR-004**: System MUST support **Zone Activation**: Enemies are asleep/invisible until the Zone is triggered.
- **FR-005**: System MUST scale Pack difficulty based on `DungeonLevel` using **Stat Multipliers** (HP/Dmg) only; composition remains fixed per Pack ID.
- **FR-006**: System MUST support **Ambush Spawns**: Enemies spawn with a **VFX Transition** (portal/burrow) of at least 1.5s to telegraph their arrival before becoming active.

#### Key Entities
- **SpawnDirector**: Singleton that manages the population logic.
- **PackRegistry**: Database of valid enemy compositions.
- **EncounterZone**: Runtime object tracking the state of a room's enemies.
- **WaveScript**: Logic for multi-stage encounters.

### Edge Cases
- **Room too small**: A "Large" pack is selected for a small room. (Fallback: Downsize pack or reroll).
- **Player rush**: Players run through rooms without killing. (Solution: Leash ranges or Door Locks).
- **Disconnect**: Player disconnects during wave 2 of 3. (Scaling should adjust dynamically or lock to start).

## Technical / How

**Architecture**:
- **Server-Side Authority**: All spawning and state management happens on the server.
- **Object Pooling**: Enemies are heavy. We will use an Object Pooling system for models to avoid instantiation lag during waves.
- **Streaming Compatibility**: The system must handle `StreamingEnabled`. Enemies far away should probably be despawned or represented by lightweight data.

**Data Structure (Pack)**:
```lua
{
  Id = "Forest_WolfPack",
  Budget = 10, -- "Cost" of this pack
  MinSize = 3,
  Members = {
    { Id = "Wolf_Alpha", Role = "Elite", Count = 1 },
    { Id = "Wolf_Pup",   Role = "Minion", Count = "2-4" }
  }
}
```

**Algorithm**:
1.  **Scan**: Identify all `EncounterZones` (Rooms) in the generated map.
2.  **Budget**: Assign a "Difficulty Budget" to each zone based on distance from start.
3.  **Select**: Pick a Pack that fits the Budget and the Room's available `EnemySpots`. **Selection is Deterministic** based on the Dungeon Seed.
4.  **Place**: Assign specific enemies from the Pack to specific Spots (e.g., Ranged enemies to "HighGround" spots).

## Risks

- **Performance**: Spawning 50 enemies at map start might lag.
    *   *Mitigation*: "Lazy Spawning". Only populate the data model. Instantiate physical models only when players approach the room.
- **Pathfinding**: Generated rooms might have disconnected navmeshes.
    *   *Mitigation*: Rely on 004's Validation Pass. If a spot is unreachable, don't spawn there.

## Implementation Status

**Last Updated**: 2026-01-12 (Sprint Complete)

### Files Created

| File | Purpose | Status |
|------|---------|--------|
| `src/server/services/SpawnDirector.ts` | Singleton managing population logic | ✅ Complete |
| `src/server/services/EnemySpawnService.ts` | Spawns individual enemies with visuals | ✅ Complete |
| `src/server/components/EncounterZone.ts` | Runtime zone state machine | ✅ Complete |
| `src/server/components/PackContext.ts` | Pack-level aggro linking | ✅ Complete |
| `src/shared/types/SpawningTypes.ts` | Shared interfaces | ✅ Complete |
| `src/shared/config/MonsterPacks.ts` | Pack definitions registry | ⚠️ Minimal |
| `src/shared/utils/ModelPool.ts` | Object pooling for performance | ✅ Complete |
| `src/shared/algorithms/wave-plan.ts` | Wave composition algorithm | ✅ Complete |
| `src/server/utils/AmbushVFX.ts` | Ambush spawn visual cue (1.5s delay) | ✅ NEW |

### Resolved This Sprint

1. ~~Spawn Point Storage~~ — `SpawnDirector.AssignSpots()` now registers spawn data with zone
2. ~~Service Integration~~ — `SpawnDirector` injects and calls `EnemySpawnService`
3. ~~Hardcoded Config~~ — Budget/biome read from room attributes
4. ~~Ambush VFX (FR-006)~~ — `AmbushVFX.ts` plays 1.5s indicator before spawn
5. ~~Zone Trigger Hook~~ — Auto-generated trigger volumes detect player entry
6. ~~WaveService Stub~~ — Removed empty file

### Remaining

- More pack definitions in `MonsterPacks.ts`

### Deferred to Future Sprints

- Streaming-aware despawn for distant zones
- Full Ambush VFX particles/sounds
- Dynamic difficulty scaling based on player count

---

## Open Questions

- **Q1: Loot Drops**: Do enemies drop loot individually or into a room chest? (Tentative: Room chest for pacing, individual for visceral feel. TBD in 008).
- **Q2: Elite Affixes**: Do Elites get random buffs (e.g., "Fire Enchanted")? (Yes, future scope).

## Success Criteria

- **SC-001**: A standard dungeon run contains between 5-10 distinct combat encounters.
- **SC-002**: No enemy spawns within line-of-sight of a player (unless it's an intentional "Ambush").
- **SC-003**: Server heartbeat remains >55fps during the spawn phase of a new room.

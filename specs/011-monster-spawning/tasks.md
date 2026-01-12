# Tasks: Monster Spawning & Encounter Design

**Feature**: 011-monster-spawning
**Status**: Implemented
**Spec**: [specs/011-monster-spawning/spec.md](./spec.md)

## Phase 1: Setup
**Goal**: Initialize project structure and core definitions.

- [x] T001 Create directory `src/server/components` if not exists
- [x] T002 Create directory `src/shared/config` if not exists
- [x] T003 Create directory `src/shared/utils` if not exists
- [x] T004 Create service skeleton `src/server/services/SpawnDirector.ts`

## Phase 2: Foundational
**Goal**: Implement shared utilities and data models required by all stories.

- [x] T005 [P] Implement `ModelPool` class in `src/shared/utils/ModelPool.ts`
- [x] T006 [P] Finalize `SpawningTypes.ts` in `src/shared/types/` matching Data Model
- [x] T007 [P] Create initial `MonsterPacks.ts` config in `src/shared/config/` with test data
- [x] T025 [P] Implement `wave-plan` algorithm in `src/shared/algorithms/wave-plan.ts` (Refactor)

## Phase 3: Populate Room (User Story 1)
**Goal**: Deterministically assign monster packs to dungeon rooms.
**Test Criteria**: `SpawnDirector` correctly reads `EnemySpot` nodes and assigns valid Packs based on budget and seed.

- [x] T008 [US1] Implement `SpawnDirector:ScanMap()` to identify `EncounterZone` areas and `EnemySpot` nodes
- [x] T009 [US1] Implement deterministic RNG selector in `SpawnDirector` (Seed-based)
- [x] T010 [US1] Implement `SpawnDirector:SelectPack()` logic matching Budget to Pack Cost
- [x] T011 [US1] Implement `SpawnDirector:AssignSpots()` to map Pack Members to `EnemySpot` metadata
- [x] T012 [US1] Create unit test verifying deterministic pack selection for a fixed seed
- [x] T026 [US1] Implement `EnemySpawnService` to handle entity instantiation

## Phase 4: Activation & Aggro (User Story 2)
**Goal**: Efficiently wake up enemies and handle Ambush logic.
**Test Criteria**: Enemies spawn/wake when player enters zone; Ambushes play VFX before attacking.

- [x] T013 [US2] Implement `EncounterZone` class in `src/server/components/EncounterZone.ts` to track state
- [x] T014 [US2] Implement `PackContext` class for shared Aggro Linking (Research Item 4)
- [x] T015 [US2] Implement `AmbushVisualizer` controller in `src/client/controllers/AmbushVisualizer.ts`
- [x] T027 [US2] Implement `AmbushVFX` server utility in `src/server/utils/AmbushVFX.ts`
- [x] T016 [US2] Connect `SpawnDirector` to listen for Zone Entry triggers (Proximity)
- [x] T017 [US2] Implement `SpawnDirector:ActivateZone()` to materialize models from `ModelPool`
- [x] T018 [US2] Implement "Difficulty Scaling" (Stats Only) application during activation

## Phase 5: Wave Spawning (User Story 3)
**Goal**: Support multi-stage arena encounters.
**Test Criteria**: Wave 2 starts only after Wave 1 is cleared or timer expires.

- [x] T019 [US3] Extend `EncounterZone` to support `WaveDefinition` logic
- [x] T020 [US3] Implement Wave Transition logic (Kill Count / Timer triggers)
- [x] T021 [US3] Add Door Locking/Unlocking hooks to `EncounterZone` state

## Phase 6: Polish & Integration
**Goal**: Final tuning and integration with other systems.

- [x] T022 Implement cleanup logic in `SpawnDirector` (Despawn far away zones)
- [x] T023 Integration: Connect `TargetingBiasService` (006) to spawned enemies
- [x] T024 Integration: Verify performance (Heartbeat) with full map population

## Dependencies

- **US1 (Population)** requires T005, T006, T007
- **US2 (Activation)** requires US1 completion (Data exists to activate)
- **US3 (Waves)** requires US2 (Zone logic)

## Parallel Execution

- T005, T006, T007 can be built in parallel.
- T015 (Client VFX) can be built parallel to T013/T014 (Server Logic).

## Implementation Strategy

1.  **MVP**: Complete Phases 1, 2, and 3. This gives us a populated map (static).
2.  **Interactive**: Complete Phase 4. This gives us actual combat.
3.  **Advanced**: Complete Phase 5 for Arena rooms.
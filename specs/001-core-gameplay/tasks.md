---
description: "Task list for IronGuard Mercs: Core Gameplay Vertical Slice"
---

# Tasks: Core Gameplay Vertical Slice

**Input**: User-provided Epics (A-H) & Plan `001-core-gameplay`
**Prerequisites**: `plan.md` (Architecture)

## Phase 1: Setup & Tooling (Epic A)

**Purpose**: Initialize Repo, Tooling, and CI Foundation

- [x] T001 Initialize repo with `roblox-ts` + `Rojo` skeleton
- [x] T002 Add Flamework bootstrap (server + client)
- [x] T003 Configure Vitest + coverage (CI-ready)
- [x] T004 Shared utilities: logging + assertions in `src/shared/utils/log.ts`

---

## Phase 2: Domain & Contracts (Epic B)

**Purpose**: Shared types and network definitions.

- [x] T005 Define shared domain types (RunConfig, RunState) in `src/shared/domain/types.ts`
- [x] T006 Define networking contracts in `src/shared/net.ts`
- [x] T007 [P] Implement Seeded RNG utility in `src/shared/algorithms/rng.ts`
- [x] T008 [P] Test Seeded RNG determinism in `src/shared/algorithms/rng.spec.ts`

---

## Phase 3: Game Loop (Epic C)

**Purpose**: Core state machine and lifecycle.

- [x] T009 Implement `RunStateMachine` (Pure Logic) in `src/shared/algorithms/run-state.ts`
- [x] T010 [P] Test `RunStateMachine` transitions in `src/shared/algorithms/run-state.spec.ts`
- [x] T011 Implement `RunService` (Server Authoritative) in `src/server/services/RunService.ts`
- [x] T012 Implement Client RunController + basic HUD in `src/client/controllers/RunController.ts`
- [ ] T012b Configure standard FPV/TPV camera settings in `src/client/controllers/CameraController.ts`

---

## Phase 4: Minimal World (Epic D)

**Purpose**: Spawn the arena.

- [x] T013 Define WorldPlan types + schema in `src/shared/domain/world.ts`
- [x] T014 [P] Implement Procgen `createWorldPlan` (Minimal) in `src/shared/algorithms/world-plan.ts`
- [x] T015 [P] Test Procgen Determinism in `src/shared/algorithms/world-plan.spec.ts`
- [x] T016 Implement Tile metadata loader (Spawn Nodes) in `src/server/services/TileService.ts`
- [x] T017 Implement `WorldSpawner` (Instantiate Tiles) in `src/server/services/WorldSpawner.ts`

---

## Phase 5: Spawning & Waves (Epic E)

**Purpose**: Populate the world.

- [x] T018 Implement `PlayerSpawnService` (Spawn at Nodes) in `src/server/services/PlayerSpawnService.ts`
- [x] T019 Define Enemy archetype config in `src/shared/domain/enemies.ts`
- [x] T020 [P] Implement `WavePlan` generator (Pure Logic) in `src/shared/algorithms/wave-plan.ts`
- [x] T021 [P] Test `WavePlan` generation in `src/shared/algorithms/wave-plan.spec.ts`
- [x] T022 Implement `EnemySpawnService` + WaveRunner in `src/server/services/EnemySpawnService.ts`

---

## Phase 6: Minimal Combat (Epic F)

**Purpose**: Damage and Death.

- [x] T023 [P] Implement `HealthComponent` (Server Auth) in `src/server/cmpts/HealthComponent.ts`
- [x] T024 [P] Test Health Logic (Pure) in `src/server/cmpts/HealthComponent.spec.ts`
- [x] T025 Implement MVP Damage Source (Touch/Tool) in `src/server/services/CombatService.ts`
- [x] T026 Implement Win/Lose Evaluation Logic in `src/server/services/MatchEvaluator.ts`

---

## Phase 7: Results & Rewards (Epic G)

**Purpose**: Close the loop.

- [x] T027 [P] Implement Rewards Calculator (Pure) in `src/shared/algorithms/rewards.ts`
- [x] T028 [P] Test Rewards Calculation in `src/shared/algorithms/rewards.spec.ts`
- [x] T029 Implement Results Aggregation & Broadcast in `src/server/services/RewardsService.ts`
- [x] T030 Implement Return to Lobby + Cleanup logic in `src/server/services/RunService.ts`

---

## Phase 8: Quality Gates (Epic H)

**Purpose**: CI and Telemetry.

- [x] T031 Implement Telemetry + Debug Overlay in `src/client/controllers/DebugController.ts`
- [x] T032 Implement Fail-fast diagnostics in `src/shared/utils/diagnostics.ts`
- [x] T033 Configure CI Gate (Build + Test + Coverage)

---

## Phase 9: Roster & Permadeath Meta (Epic I)

**Purpose**: Persistent squad management.

- [ ] T034 Define Roster domain schema in `src/shared/domain/roster.ts`
- [ ] T035 Implement Roster selection logic (Lobby integration)
- [ ] T036 Implement Permadeath logic (Remove from roster on fatal mission end)
- [ ] T037 Implement Upkeep/Recovery calculations in `src/shared/algorithms/upkeep.ts`
- [ ] T038 Implement Mode Selection (Standard vs. Ironman) in Lobby
- [ ] T039 Implement Mode-based Reward Scaling in `src/shared/algorithms/rewards.ts`

---

## Implementation Strategy

1.  **Foundation**: T001-T008 builds the repo and core types.
2.  **Game Loop**: T009-T012 gets the state machine running.
3.  **World**: T013-T017 renders the map.
4.  **Action**: T018-T026 adds players, enemies, and combat.
5.  **Loop Closure**: T027-T030 finishes the run.
6.  **Polish**: T031-T033 ensures quality.
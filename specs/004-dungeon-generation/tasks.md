---
description: "Task list for IronGuard Mercs: Full Game Foundation & Dungeon Generation"
---

# Tasks: IronGuard Mercs (Full Game & Dungeon Gen)

**Input**: User-provided Epics list & Feature Spec `004-dungeon-generation`
**Prerequisites**: `plan.md` (Architecture), `spec.md` (Dungeon Goals)

## Phase 1: Setup (Epic 0)

**Purpose**: Initialize Repo, Tooling, and CI Foundation

- [x] T001 Initialize repo with `roblox-ts` + `Rojo` skeleton
- [x] T002 Add Flamework bootstrap (server + client)
- [x] T003 Configure Vitest + coverage (CI-ready)
- [x] T004 Shared lint/format + build scripts (`package.json` config)

---

## Phase 2: Shared Domain & Game Loop (Epic 1 & 2)

**Purpose**: Core state machine, networking, and pure logic utilities.

- [x] T005 Define shared types in `src/shared/domain` (RunConfig, GameState, Entities)
- [x] T006 Define networking contracts in `src/shared/net.ts`
- [x] T007 [P] Implement Seeded RNG utility in `src/shared/algorithms/rng.ts`
- [x] T008 [P] Test Seeded RNG determinism in `src/shared/algorithms/rng.spec.ts`
- [x] T009 Implement server `RunStateMachine` in `src/server/services/MatchService.ts`
- [x] T010 [P] Test `RunStateMachine` transitions in `src/server/services/MatchService.spec.ts`
- [x] T011 Implement Client state observer & minimal HUD in `src/client/controllers/HudController.ts`
- [x] T012 Setup Event Bus with `typescript-rx` in `src/shared/events.ts`

---

## Phase 3: Procedural Generation Subsystem (Epic 3)

**Goal**: Deliver the "Dungeon Generation" feature (Spec US1 & US2) within the new architecture.

### User Story 1: Assemble Dungeon (Graph & Structure)

- [x] T013 [US1] Define Tile metadata schema & loader in `src/shared/domain/TileDefs.ts`
- [x] T014 [P] [US1] Implement Layout Graph Generator (pure logic) in `src/shared/algorithms/dungeon-gen.ts`
- [x] T015 [P] [US1] Test Layout Graph connectivity & determinism in `src/shared/algorithms/dungeon-gen.spec.ts`
- [x] T016 [US1] Implement Tile selection & connector matching logic in `src/shared/algorithms/connector-logic.ts`
- [x] T017 [US1] Test Connector matching (90 deg rotation) in `src/shared/algorithms/connector-logic.spec.ts`

### User Story 2: Validation & Instantiation

- [x] T018 [US2] Implement `DungeonService` to instantiate tiles in Workspace (`src/server/services/DungeonService.ts`)
- [x] T019 [US2] Implement Validation Pass (Guaranteed by construction) in `src/shared/algorithms/validator.ts`
- [x] T020 [US2] Test Validation logic failure modes in `src/shared/algorithms/validator.spec.ts`

### User Story 3: Metadata & Decoration

- [x] T021 [US3] Implement Metadata Extraction (SpawnPoints/EnemyNodes) in `src/server/services/DungeonService.ts`
- [ ] T022 [US3] Implement procedural Decoration pass (non-blocking) in `src/server/services/DecoratorService.ts`

---

## Phase 4: Gameplay Integration (Partial Epic 4)

**Purpose**: Player spawning and basic interaction loop.

- [x] T023 [P] Implement Player Spawn system (using Gen metadata) in `src/server/services/PlayerService.ts`

---

## Phase 5: UI/UX & Tools (Epic 5)

**Purpose**: Debugging and visibility.

- [x] T029 [P] Implement Debug Overlay (Seed, Room Count, Phase) in `src/client/controllers/DebugController.ts`
- [x] T030 [P] Implement ProcGen Visualizer (Graph View) in `src/client/ui/DebugGraph.tsx`
- [x] T031 Add Admin commands (Regen seed, Skip phase) in `src/server/cmpts/Admin.ts`

---

## Phase 6: Persistence (Epic 6)

**Purpose**: Save progress foundation.

- [x] T032 Implement DataStore wrapper & versioned schema in `src/server/services/DataService.ts`
- [x] T033 Test Data Migration logic in `src/server/services/DataService.spec.ts`
- [x] T034 Persist basic progression (currency/unlocks) in `src/server/services/ProgressionService.ts`

---

## Phase 7: Quality Gates (Epic 7)

**Purpose**: CI and Performance.

- [x] T035 Configure CI pipeline (Test + Coverage thresholds)
- [x] T036 Implement Performance Budget checks (Gen time limits) in `DungeonService.ts`
- [x] T037 Implement Error Handling & Telemetry reporting in `src/shared/telemetry.ts`

---

## Implementation Strategy

1.  **Foundation First**: T001-T012 establish the repo and game loop.
2.  **Logic Core**: T013-T017 build the pure Dungeon algorithms (Testable in Node).
3.  **Visuals**: T018-T022 bring the dungeon to life in Roblox.
4.  **Walkthrough**: T023 allows entering the map.
5.  **Polish**: Tools and persistence follow.
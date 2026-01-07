# Tasks: Core Gameplay & Vision (Real-Time)

**Input**: Design documents from `specs/001-core-gameplay/`
**Prerequisites**: plan.md, spec.md, data-model.md

**Tests**: TDD approach requested by constitution. Tests must be written before implementation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize roblox-ts project with Flamework dependencies
- [x] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T004 Setup RunConfig and MatchState schemas in `src/shared/domain/run.ts`
- [x] T005 [P] Setup Telemetry framework in `src/shared/telemetry.ts`
- [x] T006 [P] Implement `RunStateMachine` logic
- [x] T007 Implement server-authoritative `RunService` in `src/server/services/RunService.ts`
- [x] T008 [P] Implement `Net` contract for Run state synchronization
- [x] T009 Setup `WorldSpawner` foundation in `src/server/services/WorldSpawner.ts`
- [x] T010 [P] Implement `DeterministicSeedService` for procgen stability

---

## Phase 3: User Story 1 - Mission Participation (Priority: P1) 🎯 MVP

**Goal**: Complete end-to-end mission lifecycle with player movement and basic HUD.

**Independent Test**: Join a server -> Spawn as mercenary -> Move to objective -> Mission ends successfully.

### Tests for User Story 1

- [x] T011 [P] [US1] Test `RunStateMachine` transitions in `src/shared/algorithms/run-state.spec.ts`
- [x] T012 [P] [US1] Integration test for Mission FSM lifecycle in `test/integration/mission_flow.spec.ts`

### Implementation for User Story 1

- [x] T013 [US1] Implement Client `RunController` + basic HUD in `src/client/controllers/RunController.ts`
- [x] T014 [P] [US1] Configure standard FPV/TPV camera settings in `src/client/controllers/CameraController.ts`
- [x] T015 [US1] Implement `SpawnService` for player placement in `src/server/services/SpawnService.ts`
- [x] T016 [US1] Implement server-side validation to prevent multi-unit control in `src/server/services/RunService.ts`

---

## Phase 4: User Story 2 - Squad Coordination (Priority: P1)

**Goal**: Real-time combat coordination between multiple players.

**Independent Test**: Two players using abilities on a shared target; verify damage and synergy triggers.

### Tests for User Story 2

- [x] T017 [P] [US2] Unit test for combat synergy math in `src/shared/algorithms/combat.spec.ts`

### Implementation for User Story 2

- [x] T018 [US2] Implement `CombatService` (Real-time HP/Damage/Cooldown hooks) in `src/server/services/CombatService.ts`
- [x] T019 [US2] Implement ability execution validation (Server-side)
- [x] T020 [US2] Implement reactive health sync via Flamework controllers

---

## Phase 9: Roster & Permadeath Meta (Epic I)

**Purpose**: Persistent squad management and high-stakes mission modes.

**Independent Test**: Create an Ironman mercenary -> Die in mission -> Verify removal from roster.

### Tests for Phase 9

- [x] T021 [P] Unit test for Roster persistence and serialization in `src/shared/domain/roster.spec.ts`
- [x] T022 [P] Unit test for Permadeath logic in `src/shared/algorithms/permadeath.spec.ts`
- [x] T023 [P] Unit test for Upkeep/Recovery calculations in `src/shared/algorithms/upkeep.spec.ts`
- [x] T024 [P] Unit test for Ironman reward scaling in `src/shared/algorithms/rewards.spec.ts`

### Implementation for Phase 9

- [x] T025 [P] Define Roster/Mercenary domain schema in `src/shared/domain/roster.ts`
- [x] T026 Implement `RosterService` (Server) to manage player data in `src/server/services/RosterService.ts`
- [x] T027 Implement `MatchmakingService` with mode separation (Standard vs Ironman) in `src/server/services/MatchmakingService.ts`
- [x] T028 Implement server-side mission mode filtering for lobby sessions
- [x] T029 Implement Permadeath removal logic upon fatal mission resolution
- [x] T030 Implement Upkeep/Gold deduction in `src/shared/algorithms/upkeep.ts`
- [x] T031 Implement Mode Selection UI in `src/client/ui/LoadoutSelect.tsx`
- [x] T032 Implement Ironman-based reward multipliers in `src/shared/algorithms/rewards.ts`

---

## Phase N: Polish & Cross-Cutting Concerns

- [x] T033 [P] Update `GEMINI.md` with final gameplay standards
- [x] T034 [P] Documentation of `RunConfig` protocol in `specs/001-core-gameplay/contracts/Net.ts`
- [x] T035 Code cleanup: Remove legacy turn-based grid logic from `src/shared/algorithms/`
- [x] T036 Run `quickstart.md` validation on the full loop

---

## Dependencies & Execution Order

1. **Foundational (Phase 2)** must be completed before any User Story.
2. **User Story 1** is the MVP and can be worked on in parallel with foundational setup of other systems.
3. **Phase 9 (Roster)** depends on User Story 1 being able to resolve a mission.

## Parallel Execution Examples

```bash
# Data Modeling
Task: "Define Roster/Mercenary domain schema" (T025)
Task: "Implement RosterService" (T026)

# UI/UX
Task: "Implement Mode Selection UI" (T031)
Task: "Configure camera settings" (T014)
```

## Implementation Strategy

1. **Phase 1-2**: (Already partially complete).
2. **Phase 3 (MVP)**: Focus on the "Movement + State Machine" loop.
3. **Phase 9**: Add the meta-layer (Roster/Permadeath) once the mission loop is stable.

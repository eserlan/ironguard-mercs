---
description: "Task list for IronGuard Mercs: Monsters & Opponents (006)"
---

# Tasks: Monsters & Opponents (006)

**Input**: User-provided Phases (1-8) & Plan `006-monster-concept`
**Prerequisites**: `001` (Foundation), `002` (Combat), `003` (Abilities), `005` (Classes/Bias)

## Phase 1: Core Rules & Contracts (Epic A)

**Purpose**: Define the mechanics of disruption and telegraphed threat.

- [x] T001 Define Enemy domain types (Tier, Role, Move types) in `src/shared/domain/enemies/types.ts`
- [x] T002 Implement Hybrid Interrupt & Stagger state logic (Pure) in `src/shared/algorithms/enemies/break-logic.ts`
- [x] T003 [P] Test Break/Stagger logic (Soft/Hard casts) in `src/shared/algorithms/enemies/break-logic.spec.ts`
- [x] T004 Define telegraph timing and impact standards in `src/shared/domain/enemies/standards.ts`

---

## Phase 2: Targeting & Threat (Epic B)

**Purpose**: Implement the dynamic scoring-based AI targeting.

- [x] T005 [P] Implement Target Scoring algorithm (Blended weighting) in `src/shared/algorithms/enemies/target-scoring.ts`
- [x] T006 [P] Test Target Scoring logic (Role vs Bias) in `src/shared/algorithms/enemies/target-scoring.spec.ts`
- [x] T007 [P] Define Role-based priority floor rules in `src/shared/algorithms/enemies/role-floors.ts`
- [x] T008 Integrate Shield Saint Threat Bias pulses with enemy scoring in `src/server/services/TargetingBiasService.ts`

---

## Phase 3: Data Schema & Authoring (Epic C)

**Purpose**: Establish the data-driven pipeline for enemy creation.

- [x] T009 Implement Monsters & Opponents Schema + Validator in `src/shared/domain/enemies/config.ts`
- [x] T010 [P] Test Enemy Schema validation and defaults in `src/shared/domain/enemies/config.spec.ts`
- [x] T011 Implement Enemy Variant modifier system (Armoured, Cursed) in `src/shared/algorithms/enemies/variants.ts`

---

## Phase 4: Initial Enemy Roster (Epic D)

**Purpose**: Author the "Golden Set" of enemies.

- [x] T012 Author 2 Minions (Swarm, Bruiser) in `src/shared/data/enemies/minions.ts`
- [x] T013 Author 2 Elites (Controller, Artillery) in `src/shared/data/enemies/elites.ts`
- [x] T014 Author 2 Specialists (Assassin, Support) in `src/shared/data/enemies/specialists.ts`
- [x] T015 Author 1 Champion + 1 Boss-lite in `src/shared/data/enemies/bosses.ts`

---

## Phase 5: AI Behaviour & State Machine (Epic E)

**Purpose**: Implement the authoritative FSM and action scheduler.

- [x] T016 Implement Enemy State Machine (FSM) logic in `src/shared/algorithms/enemies/ai-state.ts`
- [x] T017 [P] Test AI State transitions (Recover, Pressure) in `src/shared/algorithms/enemies/ai-state.spec.ts`
- [x] T018 Implement Action Scheduler with cooldown priorities in `src/server/services/AIController.ts`

---

## Phase 6: Encounter Composition (Epic F)

**Purpose**: Manage room difficulty and spawning logic.

- [x] T019 Implement Difficulty Budget system in `src/server/services/DifficultyBudgetService.ts`
- [x] T020 Implement Spawn logic hooks (Ambush, Reinforcement) in `src/server/services/EnemyService.ts`

---

## Phase 7: Telemetry & Tuning (Epic G)

**Purpose**: Data-driven balance pass and quality assurance.

- [x] T021 Implement Metrics hooks (Death source, Interrupt success) in `src/shared/telemetry.ts`
- [x] T022 Create Tuning Documentation for TTK targets in `specs/006-monster-concept/tuning.md`

---

## Phase 8: Polish & Feedback (Epic H)

**Purpose**: Visual indicators and co-op readability.

- [x] T023 Implement Telegraph Controller (Client-side ground markers) in `src/client/controllers/TelegraphController.ts`
- [x] T024 Implement Enemy VFX Controller (Silhouette/Motif cues) in `src/client/controllers/EnemyVFXController.ts`

---

## Implementation Strategy

1.  **Rules First**: T001-T004 establishes how enemies "break" and "warn" before they "think".
2.  **Logic Core**: T005-T010 builds the scoring and schema foundation.
3.  **The Brain**: T016-T018 implements the actual AI decision loop.
4.  **Content**: T012-T015 populates the game with the initial roster.
5.  **Feedback**: T023-T024 ensures players can actually play against them.
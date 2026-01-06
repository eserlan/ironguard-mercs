---
description: "Task list for IronGuard Mercs: Progression & Level Up System (007)"
---

# Tasks: Progression & Level Up System (007)

**Input**: User-provided Phases (1-7) & Plan `007-progression-levelup`
**Prerequisites**: `001` (Foundation), `003` (Abilities), `005` (Classes)

## Phase 1: Shared Domain & Config (Epic A)

**Purpose**: Define the data structures for levels, XP, and perks.

- [x] T001 Define Progression domain types (RunLevel, MetaLevel, RewardBucket) in `src/shared/domain/progression/types.ts`
- [x] T002 Implement `PerkRegistry` and schema validator in `src/shared/domain/progression/config.ts`
- [x] T003 [P] Test Perk Schema validation and defaults in `src/shared/domain/progression/config.spec.ts`
- [x] T004 Author initial set of Run Perks (Stat nudges, Traits) in `src/shared/data/progression/starter-perks.ts`

---

## Phase 2: Pure Logic - XP & Choice Logic (Epic B & C)

**Purpose**: Core math and deterministic choice generation, tested in Node.js.

- [x] T005 [P] Implement XP threshold math and Team Level curves in `src/shared/algorithms/progression/xp-math.ts`
- [x] T006 [P] Test XP scaling and Team Level transitions in `src/shared/algorithms/progression/xp-math.spec.ts`
- [x] T007 [P] Implement `PerkResolver` (Deterministic 1-of-3 choices from seed) in `src/shared/algorithms/progression/perk-resolver.ts`
- [x] T008 [P] Test Deterministic choice generation (Seed/User consistency) in `src/shared/algorithms/progression/perk-resolver.spec.ts`
- [x] T009 [P] Implement Hard Cap enforcement logic for stat nudges in `src/shared/algorithms/progression/caps.ts`

---

## Phase 3: Server Authoritative Services (Epic D)

**Purpose**: Orchestrate the Team Level and simultaneous choice events.

- [x] T010 Implement `ProgressionService` (Manage Team XP and Level state) in `src/server/services/ProgressionService.ts`
- [x] T011 Implement `PerkService` (Server-side application of chosen rewards) in `src/server/services/PerkService.ts`
- [x] T012 Implement `TimeService` (Squad-wide Micro Slow logic) in `src/server/services/TimeService.ts`
- [x] T013 Update `RunService` to handle Safe Room choice triggers in `src/server/services/RunService.ts`

---

## Phase 4: Client Experience & UI (Epic E)

**Purpose**: The choice interface and slow-mo feedback.

- [x] T014 Implement `ProgressionController` (HUD sync + Choice event handling) in `src/client/controllers/ProgressionController.ts`
- [x] T015 Implement `LevelUpMenu.tsx` with timer, categories, and tooltips in `src/client/ui/LevelUpMenu.tsx`
- [x] T016 Implement Client-side Micro Slow visual feedback (Tweening) in `src/client/controllers/ProgressionController.ts`

---

## Phase 5: Meta Progression & Persistence (Epic F)

**Purpose**: Persistent account growth and DataStore integration.

- [x] T017 Define `PlayerProfile` versioned schema for Meta Progression in `src/shared/domain/progression/profile.ts`
- [x] T018 Implement Meta-XP accumulation and save buffering in `src/server/services/ProgressionService.ts`
- [x] T019 Integrate Meta Level unlocks with `ClassService` and `LoadoutService` in `src/server/services/`

---

## Phase 6: Hardening & Tuning (Epic G)

**Purpose**: Metrics, QA, and balance.

- [x] T020 Implement Metrics hooks for pick rates, timeouts, and slow triggers in `src/shared/telemetry.ts`
- [x] T021 Extend CI coverage gates to `shared/algorithms/progression`
- [x] T022 Document XP curves and TTK balance targets in `specs/007-progression-levelup/tuning.md`

---

## Implementation Strategy

1.  **Foundation First**: T001-T004 establishes the schema for what players can unlock.
2.  **Logic Core**: T005-T009 ensures the "Team Level" math and "Choice" randomness are solid.
3.  **The Pipeline**: T010-T013 allows the server to broadcast level-ups.
4.  **The Moment**: T014-T016 builds the high-stakes selection UI and Micro Slow.
5.  **Long-term**: T017-T019 enables persistent account growth.
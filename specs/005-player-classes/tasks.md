---
description: "Task list for IronGuard Mercs: Player Classes System (005)"
---

# Tasks: Player Classes System (005)

**Input**: User-provided Epics (A-H) & Plan `005-player-classes`
**Prerequisites**: `001` (Foundation), `002` (Combat), `003` (Abilities)

## Phase 1: Shared Domain & Config (Epic A)

**Purpose**: Define the data structures for classes and dual-action abilities.

- [x] T001 Define Class domain types (ClassId, ClassConfig, LoadoutRules) in `src/shared/domain/classes/types.ts`
- [x] T002 Extend `AbilityDefinition` for Top/Bottom variants in `src/shared/domain/abilities/types.ts`
- [x] T003 [P] Implement ClassConfig registry and schema validator in `src/shared/domain/classes/config.ts`
- [x] T004 Author initial class configs: Shield Saint + Ashblade in `src/shared/data/classes/starter.ts`

---

## Phase 2: Pure Logic - Rules & Validation (Epic B1, C1, F1)

**Purpose**: Math and rule verification in Node.js.

- [x] T005 [P] Implement Pure Loadout Validator (Library subset, slot count) in `src/shared/algorithms/classes/loadout-val.ts`
- [x] T006 [P] Test Loadout Validation (Accept/Reject matrix) in `src/shared/algorithms/classes/loadout-val.spec.ts`
- [x] T007 [P] Implement `SlotCooldownManager` (Shared bucket logic) in `src/shared/algorithms/classes/slot-cooldowns.ts`
- [x] T008 [P] Test Shared Cooldown behavior (Top blocks Bottom) in `src/shared/algorithms/classes/slot-cooldowns.spec.ts`
- [x] T009 [P] Implement `ThreatBias` model (Soft taunt decay/stack) in `src/shared/algorithms/classes/threat-bias.ts`
- [x] T010 [P] Test Threat Bias math (Pure) in `src/shared/algorithms/classes/threat-bias.spec.ts`

---

## Phase 3: Server Services & Networking (Epic B2-B4, C2-C3)

**Purpose**: Establishing authority over class and slot state.

- [x] T011 Implement `ClassService` (Serve ClassList to clients) in `src/server/services/ClassService.ts`
- [x] T012 Implement `LoadoutService` (Store validated player loadouts) in `src/server/services/LoadoutService.ts`
- [x] T013 Update `AbilityIntent` network contract to slot-based payload in `src/shared/net.ts`
- [x] T014 Update `AbilityService` to resolve (slotIndex, action) -> Variant in `src/server/services/AbilityService.ts`
- [x] T015 Implement `EnemyTargetingBiasService` (Soft taunt integration) in `src/server/services/TargetingBiasService.ts`

---

## Phase 4: User Story 3 - Top/Bottom Casting (Epic C4, E3)

**Goal**: Enable the choice between two actions per slot.

- [x] T016 [US3] Implement Client input mapping (Shift + Key for Top) in `src/client/controllers/AbilityBarController.ts`
- [x] T017 [US3] Implement Ability Bar UI with dual-action cues and slot cooldowns in `src/client/ui/AbilityBar.tsx`
- [x] T018 [US3] Wire up `SlotCooldownState` sync from server to client in `src/shared/net.ts`

---

## Phase 5: User Story 1 - Shield Saint (Epic F2-F3, G1, E4)

**Goal**: Deliver the Protector role.

- [x] T019 [US1] Define Shield Saint ability set (Shield Wall, Rescue Leap, Bash) in `src/shared/data/abilities/shield-saint.ts`
- [x] T020 [US1] Implement Enemy Targeting integration for Bias signals in `src/server/services/EnemyAIService.ts`
- [x] T021 [US1] Implement "Top action used" co-op signaling (Visual Pings) in `src/client/controllers/VFXController.ts`

---

## Phase 6: User Story 2 - Ashblade (Epic G2)

**Goal**: Deliver the Striker role.

- [x] T022 [US2] Define Ashblade ability set (Lunge Strike, shadowstep, Execute) in `src/shared/data/abilities/ashblade.ts`
- [x] T023 [US2] Verify Ashblade mobility chain (Pure logic or integration test)

---

## Phase 7: Lobby & Selection UI (Epic E1-E2, D1-D3)

**Purpose**: Preparing for the run.

- [x] T024 Implement Class Selection UI (Lobby) in `src/client/ui/ClassSelect.tsx`
- [x] T025 Implement Loadout Selection UI (Lobby) in `src/client/ui/LoadoutSelect.tsx`
- [x] T026 Implement Server-side "Kit Application" at run start (Apply stats/loadout) in `src/server/services/MatchService.ts`

---

## Phase 8: Hardening & Diagnostics (Epic H)

**Purpose**: Quality control.

- [x] T027 Extend CI coverage gates to `shared/algorithms/classes`
- [x] T028 Implement Debug Overlay for Class/Slot/Cooldown state in `src/client/controllers/DebugController.ts`

---

## Phase 9: Shield Saint Kit Implementation (Completed)

**Goal**: Fully realize the Protector kit through the Abilities Framework.

- [x] T029 [P] Create unit tests for Shield and Mitigation resolution in `src/server/services/EffectService.spec.ts`
- [x] T030 Implement `EffectType.Shield` in `src/server/services/EffectService.ts`
- [x] T031 Implement `EffectType.MitigationMod` in `src/server/services/EffectService.ts`
- [x] T032 Implement `EffectType.Status` (Cleanse, Marked, Interrupt) in `src/server/services/EffectService.ts`
- [x] T033 Implement `EffectType.StatMod` (Speed, Redirect) in `src/server/services/EffectService.ts`
- [x] T034 Implement "Pillar of Light" VFX for `SANCTUARY_STEP` (Top) in `src/client/controllers/VFXController.ts`
- [x] T035 Implement "Shield Burst" VFX for `AEGIS_PULSE` (Top) in `src/client/controllers/VFXController.ts`
- [x] T036 Implement "Great Oath" VFX for `MARTYRS_PROMISE` (Top) in `src/client/controllers/VFXController.ts`
- [x] T037 Verify Shield Saint solo play flow per SC-002 (Variant Cooldowns)
- [x] T038 Verify Shield Saint co-op play flow per SC-004 (10s survival against 30 DPS)

---

## Phase 10: Ashblade Kit Implementation (In Progress)

**Goal**: Fully realize the Striker kit with mobility, status effects, and burst damage.

- [x] T039 [P] Create unit tests for status logic (Scorch, Tether, Slow) in `src/shared/algorithms/combat/status-sim.spec.ts`
- [x] T040 Implement `EffectType.Status` handlers for (Scorch, Slow, Highlighted, Tether)
- [x] T041 [P] Create unit tests for AoE radius/falloff in `src/shared/algorithms/combat/damage.spec.ts`
- [x] T042 Implement AoE Damage support in `StandardEffects.applyDamage`
- [x] T043 Implement "Cinder Dash" VFX for `CINDER_STEP` (Top) in `src/client/controllers/VFXController.ts`
- [x] T044 Implement "Blaze Finisher" VFX for `BLAZE_FINISHER` (Top) in `src/client/controllers/VFXController.ts`
- [x] T045 Verify Ashblade mobility chain logic (SC-003)
- [x] T046 Final integration pass for all class abilities in `src/server/services/AbilityService.ts`
- [x] T047 Implement `Untargetable` state in `TargetingBiasService.ts` and integrate with `CINDER_STEP`
- [x] T048 Implement `Scorch` consumption logic in `EffectService.ts` for `BLAZE_FINISHER` (Top)

## Implementation Strategy

1.  **Architecture First**: T001-T004 establishes the new dual-variant ability schema.
2.  **Logic Core**: T005-T010 ensures shared cooldowns and loadout rules work in isolation.
3.  **The Hook**: T011-T015 allows the server to recognize classes and slots.
4.  **Interaction**: T016-T018 builds the Top/Bottom feeling for players.
5.  **Role Delivery**: T019-T023 implements the actual class mechanics.
6.  **UX**: T024-T026 finishes the prep-loop.

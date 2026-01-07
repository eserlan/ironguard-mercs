---
description: "Task list for IronGuard Mercs: Gear & Equipment System (008)"
---

# Tasks: Gear & Equipment System (008)

**Input**: Design artifacts from `specs/008-gear-equipment/`
**Prerequisites**: `001` (Foundation), `002` (Combat), `003` (Abilities)

## Phase 1: Shared Domain & Config (Epic A)

**Purpose**: Define the data structures for items, slots, and rarities.

- [x] T001 Define Gear domain types (EquipmentSlot, GearType, Rarity) in `src/shared/domain/gear/types.ts`
- [x] T002 Implement `GearRegistry` and schema validator in `src/shared/domain/gear/config.ts`
- [x] T003 [P] Test Gear Schema validation in `src/shared/domain/gear/config.spec.ts`
- [x] T004 Author initial set of Starter Gear (1 per slot) in `src/shared/data/gear/starter.ts`

---

## Phase 2: Pure Logic - Rules & Triggers (Epic B)

**Purpose**: Implementation of stat caps and trigger evaluation logic (Node-testable).

- [x] T005 [P] Implement `gear-caps.ts` (CDR, Damage Amp clamping) in `src/shared/algorithms/gear/gear-caps.ts`
- [x] T006 [P] Test Gear Stat Caps logic in `src/shared/algorithms/gear/gear-caps.spec.ts`
- [x] T007 [P] Implement `trigger-eval.ts` (Event matching for on_block, on_hit) in `src/shared/algorithms/gear/trigger-eval.ts`
- [x] T008 [P] Test Trigger Evaluation logic in `src/shared/algorithms/gear/trigger-eval.spec.ts`
- [x] T009 [P] Implement `stacking-rules.ts` (Multi-item modifier aggregation) in `src/shared/algorithms/gear/stacking-rules.ts`

---

## Phase 3: Server Authoritative Services (Epic D)

**Purpose**: Orchestrate equipment state and authoritative effects.

- [x] T010 Implement `GearService` (Manage PlayerEquipment state) in `src/server/services/GearService.ts`
- [x] T011 Implement `GearEffectService` (Subscribe to Combat events and resolve triggers) in `src/server/services/GearEffectService.ts`
- [x] T012 Implement `LootService` (Chest spawning + Drop table logic) in `src/server/services/LootService.ts`
- [x] T013 Update `net.ts` with `EquipItem` and `GearEffectTriggered` remotes in `src/shared/net.ts`

---

## Phase 4: User Stories & Integration

### User Story 1: Equipping Gear (Safe Room)

- [x] T014 [US1] Implement Safe Room check for Gear swaps in `src/server/services/GearService.ts`
- [x] T015 [US1] Implement `GearPanel.tsx` (Lobby/Safe Room inventory UI) in `src/client/ui/GearPanel.tsx`
- [x] T016 [US1] Implement `GearController` (Client input for equipping) in `src/client/controllers/GearController.ts`

### User Story 2: Passive/Reactive Triggers

- [x] T017 [US2] Wire `GearEffectService` to `CombatService` (002) event hooks in `src/server/services/GearEffectService.ts`
- [x] T018 [US2] Implement visual feedback for gear procs in `src/client/controllers/GearVFXController.ts`

### User Story 3 & 4: Actives & Consumables

- [x] T019 [US3] Implement Active gear cooldown sync in `src/server/services/GearService.ts`
- [x] T020 [US4] Implement Consumable charge replenishment in `src/server/services/GearService.ts`

### User Story 5: Rarity Restrictions

- [x] T021 [US5] Enforce Exotic limit (max 1) in `src/shared/algorithms/gear/compatibility.ts`
- [x] T022 [US5] Test Exotic limit and Class compatibility in `src/shared/algorithms/gear/compatibility.spec.ts`

---

## Phase 5: Hardening & Tuning

**Purpose**: Metrics and balance targets.

- [x] T023 Implement metrics for gear equip rates and proc frequency in `src/shared/telemetry.ts`
- [x] T024 Final validation of global stat caps across all systems
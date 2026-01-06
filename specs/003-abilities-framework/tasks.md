---
description: "Task list for IronGuard Mercs: Abilities Framework (003)"
---

# Tasks: Abilities Framework (003)

**Input**: User-provided Epics (A-C) & Plan `003-abilities-framework`
**Prerequisites**: `plan.md` (Architecture), `002-combat-system` (Damage)

## Phase 1: Shared Domain & Config (Epic A)

**Purpose**: Define the schema and data for abilities.

- [x] T001 Define Ability domain types (AbilityId, EffectBlock, AbilityIntent) in `src/shared/domain/abilities/types.ts`
- [x] T002 Implement AbilityConfig Schema & Validator in `src/shared/domain/abilities/config.ts`
- [x] T003 [P] Test AbilityConfig Schema validation in `src/shared/domain/abilities/config.spec.ts`
- [x] T004 Create 3 Starter Ability Configs (Dash, Shield, Fireball) in `src/shared/data/abilities/`

---

## Phase 2: Pure Logic - State & Validation (Epic B & C)

**Purpose**: Core math and rules, tested in Node.

- [x] T005 [P] Implement CooldownManager (Pure) in `src/shared/algorithms/abilities/cooldowns.ts`
- [x] T006 [P] Test Cooldown Logic (Time/Charges) in `src/shared/algorithms/abilities/cooldowns.spec.ts`
- [x] T007 [P] Implement Targeting Payload Validators (Range, Type) in `src/shared/algorithms/abilities/validation.ts`
- [x] T008 [P] Test Targeting Validation Rules in `src/shared/algorithms/abilities/validation.spec.ts`
- [x] T009 Implement Line-of-Sight Helper (Server Wrapper) in `src/server/services/LOSService.ts`

---

## Phase 3: Server Runtime - Execution Pipeline (Epic D)

**Purpose**: The "Top" of the Top/Bottom model.

- [x] T010 Implement AbilityService (Orchestrator) in `src/server/services/AbilityService.ts`
- [x] T011 Implement EffectBlock Resolver (Dispatcher) in `src/server/services/EffectService.ts`
- [x] T012 Implement Standard Effect Blocks (Damage, Heal) in `src/server/components/abilities/StandardEffects.ts`
- [x] T013 Implement ProjectileService (Server Sim) in `src/server/services/ProjectileService.ts`
- [x] T014 Wire up Ability Events (Activated, Rejected, EffectApplied) in `src/server/services/AbilityService.ts`

---

## Phase 4: Client Runtime - Feel & VFX (Epic E)

**Purpose**: The "Bottom" of the Top/Bottom model.

- [x] T015 Implement AbilityController (Input -> Intent) in `src/client/controllers/AbilityController.ts`
- [x] T016 Implement Client Cooldown Prediction (Optimistic) in `src/client/controllers/AbilityController.ts`
- [x] T017 Implement VFXController (Cast/Impact Handlers) in `src/client/controllers/VFXController.ts`
- [x] T018 Implement UI: Cooldown Bar & Cast Indicators in `src/client/ui/AbilityHUD.tsx`

---

## Phase 5: Integration & Content

**Purpose**: Verify the 3 Archetypes.

- [x] T019 Verify Dash Ability (Movement Physics)
- [x] T020 Verify Shield Ability (Status Application)
- [x] T021 Verify Fireball Ability (Projectile + Damage)

---

## Implementation Strategy

1.  **Schema First**: T001-T004 ensures we know *what* we are building.
2.  **Brain First**: T005-T008 builds the logic safely.
3.  **Authority Second**: T010-T014 builds the server core.
4.  **Feedback Last**: T015-T018 builds the UI/VFX.
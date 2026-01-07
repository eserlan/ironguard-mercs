# Tasks: Combat System (002)

**Input**: Design artifacts from `specs/002-combat-system/`
**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`

**Tests**: TDD required. Unit tests in Vitest for all logic.

## Phase 1: Foundation & Types (Epic A)

- [x] T001 Define Combat domain types (CombatIntent, DamageResult) in `src/shared/domain/combat/types.ts`
- [x] T002 Implement WeaponConfig in `src/shared/domain/combat/config.ts`
- [x] T003 Implement Seeded RNG injection for combat rolls in `src/shared/algorithms/combat/rng.ts`
- [x] T004 Test RNG Determinism for combat in `src/shared/algorithms/combat/rng.spec.ts`

---

## Phase 2: Pure Logic - Damage Pipeline (Epic B)

- [x] T005 [P] Implement Mitigation Curve (Armor/Defense) in `src/shared/algorithms/combat/mitigation.ts`
- [x] T006 [P] Test Mitigation Curve edge cases in `src/shared/algorithms/combat/mitigation.spec.ts`
- [x] T007 [P] Implement Crit Roll Logic integrated with `DeterministicSeedService` in `src/shared/algorithms/combat/crit.ts`
- [x] T008 [P] Implement Damage Resolver with Synergy support in `src/shared/algorithms/combat/damage.ts`
- [x] T009 [P] Test Damage Resolver synergy and fatal edge cases in `src/shared/algorithms/combat/damage.spec.ts`
- [x] T010 Implement Attribution Rules (Kills/Assists) in `src/shared/algorithms/combat/attribution.ts`

---

## Phase 3: Status Effects (Epic C)

- [x] T011 Define Status Config & Rules in `src/shared/domain/combat/status.ts`
- [x] T012 Implement Status Simulation (Tick/Expiry) in `src/shared/algorithms/combat/status-sim.ts`
- [x] T013 Test Status Simulation timing in `src/shared/algorithms/combat/status-sim.spec.ts`

---

## Phase 4: Server Runtime (Epic D)

- [x] T014 Implement Combatant Registry using `HealthComponent` attributes in `src/server/services/CombatService.ts`
- [x] T015 Implement distance-based and cooldown-based Intent Validation in `src/server/services/CombatValidation.ts`
- [x] T016 Test Combat Validator Logic (Pure) in `src/shared/algorithms/combat/validation.spec.ts`
- [x] T017 Implement Server Hit Detection (Raycast) in `src/server/services/HitDetectionService.ts`
- [x] T018 Implement Server Hit Detection (OverlapParams) in `src/server/services/HitDetectionService.ts`
- [x] T019 [US3] Finalize `CombatService` loop (Hit Detection -> Resolution -> Health Attribute Update)
- [x] T020 [US4] Implement Dash/Dodge server-side validation and I-frame logic

---

## Phase 5: Client Experience (Epic E)

- [x] T021 Implement Client Input handling (Ability Keys, Dash) in `src/client/controllers/CombatController.ts`
- [x] T022 Implement Client-side prediction for hit markers in `src/client/controllers/FeedbackController.ts`
- [x] T023 Implement Billboard Health Bars in `src/client/ui/HealthBar.tsx`

---

## Phase 6: Enemies & AI (Epic F)

- [x] T024 Implement Chaser Enemy AI using real-time pathfinding in `src/server/services/AIController.ts`
- [x] T025 Implement Ranged Enemy AI (kiting/strafing) in `src/server/services/AIController.ts`

---

## Phase N: Quality & Integration

- [x] T026 Connect `CombatService` to `RunService` for mission-end triggers
- [x] T027 Connect `CombatService` to `RosterService` for permadeath handling
- [x] T028 Audit all combat algorithms for Node/Roblox compatibility (Vitest validation)
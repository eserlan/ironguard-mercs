---
description: "Task list for IronGuard Mercs: Combat System (002)"
---

# Tasks: Combat System (002)

**Input**: User-provided Epics (A-G) & Plan `002-combat-system`
**Prerequisites**: `plan.md` (Architecture), `001-core-gameplay` (Foundation)

## Phase 1: Foundation & Types (Epic A)

**Purpose**: Define the shared language of combat.

- [x] T001 Define Combat domain types (CombatIntent, DamageResult) in `src/shared/domain/combat/types.ts`
- [x] T002 Implement WeaponConfig & EnemyArchetypeConfig in `src/shared/domain/combat/config.ts`
- [x] T003 Implement Seeded RNG injection for combat rolls in `src/shared/algorithms/combat/rng.ts`
- [x] T004 Test RNG Determinism for combat in `src/shared/algorithms/combat/rng.spec.ts`

---

## Phase 2: Pure Logic - Damage Pipeline (Epic B)

**Purpose**: Server-authoritative math, tested in Node.

- [x] T005 [P] Implement Mitigation Curve (Armor/Defense) in `src/shared/algorithms/combat/mitigation.ts`
- [x] T006 [P] Test Mitigation Curve edge cases in `src/shared/algorithms/combat/mitigation.spec.ts`
- [x] T007 [P] Implement Crit Roll Logic in `src/shared/algorithms/combat/crit.ts`
- [x] T008 [P] Implement Damage Resolver (Pure) in `src/shared/algorithms/combat/damage.ts`
- [x] T009 [P] Test Damage Resolver invariants (No negative damage) in `src/shared/algorithms/combat/damage.spec.ts`
- [x] T010 Implement Attribution Rules (Kills/Assists) in `src/shared/algorithms/combat/attribution.ts`

---

## Phase 3: Status Effects (Epic C)

**Purpose**: Data-driven buffs/debuffs.

- [x] T011 Define Status Config & Rules (Stacking/Refresh) in `src/shared/domain/combat/status.ts`
- [x] T012 Implement Status Simulation (Tick/Expiry) in `src/shared/algorithms/combat/status-sim.ts`
- [x] T013 Test Status Simulation timing in `src/shared/algorithms/combat/status-sim.spec.ts`

---

## Phase 4: Server Runtime (Epic D)

**Purpose**: The "Body" of the combat system.

- [x] T014 Implement Combatant Registry & Health Component in `src/server/services/CombatService.ts`
- [x] T015 Implement Combat Intent Validation (Rate Limit, Distance) in `src/server/services/CombatValidation.ts`
- [x] T016 Test Combat Validator Logic (Pure) in `src/server/services/CombatValidation.spec.ts`
- [x] T017 Implement Server Hit Detection (Hitscan Raycast) in `src/server/services/HitDetection.ts`
- [x] T018 Implement Server Hit Detection (Melee Overlap) in `src/server/services/HitDetection.ts`
- [x] T019 [US3] Wire up Damage Application, Death (Destroy), and isFatal Event in `src/server/services/CombatService.ts`
- [x] T020 [P] [US3] Test Damage-to-Death loop (isFatal: true) in `src/shared/algorithms/combat/damage.spec.ts`

---

## Phase 5: Client Experience (Epic E)

**Purpose**: Feel and Feedback.

- [x] T021 Implement Client Input to CombatIntent in `src/client/controllers/CombatController.ts`
- [x] T021 Implement Client Feedback (Crosshair, Hit Marker) in `src/client/controllers/FeedbackController.ts`
- [x] T023 Implement Billboard Health Bars in `src/client/ui/HealthBar.tsx`

---

## Phase 6: Enemies & AI (Epic F)

**Purpose**: Things to fight.

- [x] T024 Implement Chaser Enemy AI (Baseline) in `src/server/services/EnemyService.ts`
- [x] T025 Implement Ranged Enemy AI (Baseline) in `src/server/services/EnemyService.ts`
- [x] T026 Integrate Enemy Spawning with WaveRunner in `src/server/services/WaveService.ts`

---

## Phase 7: Quality Gates (Epic G)

**Purpose**: Hardening.

- [x] T027 Implement Combat Telemetry & Suspicion Logging in `src/server/services/CombatLogging.ts`
- [x] T028 Configure Coverage Thresholds for `src/shared/algorithms/combat`
- [x] T029 Document Tuning Knobs (Damage, Cooldowns) in `specs/002-combat-system/tuning.md`

---

## Implementation Strategy

1.  **Math First**: T005-T009 ensures the numbers are right before we spawn a single part.
2.  **Server Authority**: T014-T019 builds the secure core.
3.  **Client Feel**: T020-T022 makes it playable.
4.  **AI**: T023-T025 adds the challenge.

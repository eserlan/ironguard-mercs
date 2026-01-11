# Tasks: Humanoid Enemy Visual Pipeline (MVP)

**Feature**: Humanoid Enemy Visual Pipeline
**Status**: Done
**Spec**: [specs/010-enemy-visuals/spec.md](./spec.md)

## Dependencies

- **Phase 1 (Setup)**: Must run first.
- **Phase 2 (Foundational)**: Blocks US1 and US2.
- **Phase 3 (US1)**: Blocks US2.
- **Phase 4 (US2)**: Depends on US1 logic.

## Parallel Execution

- T002 and T003 can be done in parallel.
- T005 and T008 (Test creation) can be done in parallel.

## Implementation Strategy

We will implement the core data structures first, then the service logic, and finally verify with in-game tests. The service logic will be built incrementally, starting with basic appearance application and then adding scaling and weapon attachment.

---

### Phase 1: Setup
*Goal: Ensure project structure is ready for assets.*

- [x] T001 Verify (and create if missing) `ServerStorage/EnemyRigs` and `ServerStorage/Weapons` folders in `default.project.json` and the physical project structure.

### Phase 2: Foundational
*Goal: Define the shared data structures required for the pipeline.*

- [x] T002 Create `src/shared/domain/enemies/visual-types.ts` defining `EnemyVisualProfile` and `EnemyVisualConfig` interfaces.
- [x] T003 Create `src/shared/domain/enemies/visual-profiles.ts` with initial `VisualProfiles` registry and at least one example profile.
- [x] T004 Update `src/shared/domain/enemies/config.ts` to extend `EnemyArchetype` with the `visual` property (referencing `EnemyVisualConfig`).

### Phase 3: User Story 1 - Data-Only Enemy Creation
*Goal: Spawn an enemy that visually matches a defined profile (assets + colors).*

- [x] T005 [P] [US1] Create integration test `test/server/EnemyVisualService.spec.ts` to verify service existence and basic methods.
- [x] T006 [US1] Implement `EnemyVisualService.ts` basic structure and `setupEnemyVisuals` method signature in `src/server/services/EnemyVisualService.ts`.
- [x] T007 [US1] Implement private `applyVisualProfile` method in `src/server/services/EnemyVisualService.ts` to construct and apply `HumanoidDescription` (Assets + Colors).
- [x] T008 [US1] Update `src/server/services/EnemySpawnService.ts` to inject `EnemyVisualService` and call `setupEnemyVisuals` on spawn.

### Phase 4: User Story 2 - Visual Distinction & Scaling
*Goal: Support scaling and weapon attachment for visual variety.*

- [x] T009 [US2] Update `EnemyVisualService.ts` to read scale properties from profile and apply them to `HumanoidDescription` in `src/server/services/EnemyVisualService.ts`.
- [x] T010 [US2] Implement `attachWeapon` method in `src/server/services/EnemyVisualService.ts` to clone and weld weapon models from `ServerStorage`.
- [x] T011 [US2] Add a "Giant" profile variant to `src/shared/domain/enemies/visual-profiles.ts` for visual verification.
- [x] T012 [US2] Update `src/shared/data/enemies/minions.ts` (or similar) to use the new visual profiles for existing enemies.

### Phase 5: Polish & Cross-Cutting
*Goal: Final verification and cleanup.*

- [x] T013 Verify error handling: Ensure missing profiles or assets log warnings but do not crash the server in `src/server/services/EnemyVisualService.ts`.
- [x] T014 Run manual visual verification in-game (Quickstart Scenario 1 & 2).
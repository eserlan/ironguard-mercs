# Tasks: Save Player Progression

**Feature**: `012-save-player-progression`
**Status**: Pending
**Spec**: [spec.md](./spec.md)

## Implementation Strategy

We will implement a custom `PlayerDataService` to manage persistent player data. The implementation will start with defining the data shape in shared code, then building the server-side service to handle DataStore operations (Load, Save, Autosave). We will prioritize a "One Profile per Class" model where all class data resides in a single player document.

## Dependencies

1. **US1 (New Player)**: Depends on Data Model and Service Shell.
2. **US2 (Persistence)**: Depends on US1 (need a profile to save).
3. **US3 (Multi-Class)**: Depends on US2 (need robust saving for complex data).

## Phase 1: Setup

- [x] T001 Create shared data definitions for `PlayerProfile` and `ClassRecord` in `src/shared/data/profiles.ts`
- [x] T002 Create `PlayerDataService` shell with Flamework decorators in `src/server/services/PlayerDataService.ts`
- [x] T003 Create `PlayerDataController` shell for client-side sync in `src/client/controllers/PlayerDataController.ts`

## Phase 2: Foundational

- [x] T004 Define `ProfileCache` in `PlayerDataService` to store loaded profiles in memory in `src/server/services/PlayerDataService.ts`
- [x] T005 [P] Implement `DataStore` initialization in `PlayerDataService` constructor in `src/server/services/PlayerDataService.ts`

## Phase 3: User Story 1 - New Player Initialization (P1)

**Goal**: A first-time player joins and receives a default profile.
**Independent Test**: Join with a new UserID (or mocked ID) and verify `DEFAULT_PROFILE` is loaded into memory.

- [x] T006 [US1] Create unit test file `src/server/services/PlayerDataService.spec.ts` to verify default profile generation
- [x] T007 [US1] Implement `loadProfile(player)` method in `PlayerDataService` to fetch from DataStore or use default in `src/server/services/PlayerDataService.ts`
- [x] T008 [US1] Hook into `Players.PlayerAdded` to trigger `loadProfile` in `src/server/services/PlayerDataService.ts`
- [x] T009 [US1] Implement retry logic for initial load failure (kick player if critical fail) in `src/server/services/PlayerDataService.ts`

## Phase 4: User Story 2 - Returning Player Persistence (P1)

**Goal**: Player progress is saved on exit and restored on return.
**Independent Test**: Modify a profile value in memory, simulate disconnect, verify DataStore is updated. Rejoin and verify value persists.

- [x] T010 [US2] Update `src/server/services/PlayerDataService.spec.ts` to verify save logic and session locking mocks
- [x] T011 [US2] Implement `saveProfile(player)` method using `UpdateAsync` with session locking checks in `src/server/services/PlayerDataService.ts`
- [x] T012 [US2] Hook into `Players.PlayerRemoving` to trigger `saveProfile` in `src/server/services/PlayerDataService.ts`
- [x] T013 [US2] Implement `BindToClose` handler to ensure all profiles save on server shutdown in `src/server/services/PlayerDataService.ts`
- [x] T014 [US2] Implement autosave loop (every 5 minutes) for all cached profiles in `src/server/services/PlayerDataService.ts`
- [x] T015 [US2] Implement session locking: `ActiveSessionId` validation in `UpdateAsync` logic in `src/server/services/PlayerDataService.ts`

## Phase 5: User Story 3 - Multi-Class Progression (P2)

**Goal**: Independent progression tracking for different classes.
**Independent Test**: Call `updateClassProgress("Mage", ...)` then `updateClassProgress("Warrior", ...)`. Verify both entries exist in `Profile.Classes`.

- [x] T016 [US3] Update `src/server/services/PlayerDataService.spec.ts` to verify multi-class data isolation
- [x] T017 [US3] Add `setClassLoadout(player, classId, loadout)` API to `PlayerDataService` in `src/server/services/PlayerDataService.ts`
- [x] T018 [US3] Add `addXP(player, classId, amount)` API to `PlayerDataService` handling level-up logic in `src/server/services/PlayerDataService.ts`
- [x] T019 [US3] Update `Global.LastSelectedClassId` when player spawns/selects class in `src/server/services/PlayerDataService.ts`

## Phase 6: Polish & Cross-Cutting

- [ ] T020 [P] Implement client-side listener in `PlayerDataController` to receive profile updates (e.g. for UI) in `src/client/controllers/PlayerDataController.ts`
- [x] T021 Add specific error logging for DataStore limits/throttling in `src/server/services/PlayerDataService.ts`
- [x] T022 Review serialization to ensure no complex objects (only IDs) are stored in `src/server/services/PlayerDataService.ts`

## Phase 7: PlayerDataController Implementation

**Goal**: Complete client-side sync so UI can display player progression data.
**Test Criteria**: Client receives profile updates on join and on data changes; UI can read current level/XP/loadout.

- [ ] T023 [P] Define `ProfileUpdated` network event in `src/shared/net.ts` for server→client profile sync
- [ ] T024 [P] Add `PlayerDataService.sendProfileToClient(player)` method to fire profile data to client
- [ ] T025 [P] Call `sendProfileToClient` after load and after any mutation (setClassLoadout, addXP, setSelectedClass)
- [ ] T026 [P] Implement `PlayerDataController.onProfileUpdated(profile)` handler to store local copy
- [ ] T027 [P] Expose `PlayerDataController.getProfile()` API for UI components to read current data
- [ ] T028 [P] Add unit tests for `PlayerDataController` profile caching in `src/client/controllers/PlayerDataController.spec.ts`

## Parallel Execution Examples

- **US1 & US2**: One developer can work on loading logic (T006-T008) while another sets up the structure (T001-T005), but Save logic (US2) strictly depends on Load logic (US1).
- **Client Sync**: T003 and T017 can be built in parallel with the server-side logic once the shared data shape (T001) is defined.
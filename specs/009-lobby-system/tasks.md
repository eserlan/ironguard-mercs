# Tasks: Lobby System (3D Immersive)

**Input**: Design documents from `/specs/009-lobby-system/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization for 3D world components.

- [X] T001 Create project structure for 3D hub components in `src/client/components/Lobby/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and state updates required for 3D interactions.

**⚠️ CRITICAL**: Must complete before user stories to ensure proximity and world state are available.

- [X] T002 [P] Update LobbyService.ts to support `difficulty` and `isOnPad` state in `src/server/services/LobbyService.ts`
- [X] T003 [P] Update LobbyController.ts to manage "AtStation" state and station events in `src/client/controllers/LobbyController.ts`
- [X] T004 Implement StationComponent.ts base class for ProximityPrompt management in `src/client/components/Lobby/StationComponent.ts`

**Checkpoint**: Foundation ready - world-to-code binding is now possible.

---

## Phase 3: User Story 1 - Solo Quick Launch (Priority: P0) 🎯 MVP

**Goal**: Enable a solo player to spawn, select a mercenary at a locker, and enter the portal to start a mission.

**Independent Test**: Spawn in Hub -> Locker (Press E) -> Select Mercenary -> Portal -> Starts mission with selected merc.

### Tests for User Story 1 (Unit & Integration)

- [X] T005 [US1] Unit test for solo launch validation in `src/server/services/LobbyService.spec.ts`

### Implementation for User Story 1

- [X] T006 [P] [US1] Implement MercenaryLockerComponent.ts (ProximityPrompt) in `src/client/components/Lobby/MercenaryLockerComponent.ts`
- [X] T007 [P] [US1] Implement DungeonPortalComponent.ts (Touch detection) in `src/client/components/Lobby/DungeonPortalComponent.ts`
- [X] T008 [US1] Refactor Lobby.tsx for contextual rendering and ensure 2D HUD synchronizes with world-space difficulty/mode in `src/client/ui/apps/Lobby.tsx`

**Checkpoint**: Solo MVP is functional.

---

## Phase 4: User Story 2 - Form Party (Priority: P1)

**Goal**: Form or join a party by standing on the physical Party Pad.

**Independent Test**: Player A stands on pad -> Room Code appears on BillboardGui -> Player B stands on pad -> Both see each other in Party HUD.

### Tests for User Story 2

- [X] T009 [US2] Unit test for pad-to-party logic and room cleanup in `src/server/services/LobbyService.spec.ts`

### Implementation for User Story 2

- [X] T010 [US2] Implement PartyPadComponent.ts using `GetPartsInPart` for detection in `src/client/components/Lobby/PartyPadComponent.ts`
- [X] T011 [US2] Create LobbyBillboard.tsx for world-space Room Code display in `src/client/ui/components/LobbyBillboard.tsx`
- [X] T012 [US2] Update LobbyService.ts to handle auto-join/leave logic based on pad state in `src/server/services/LobbyService.ts`

---

## Phase 5: User Story 3 - Configure Mission (Priority: P1)

**Goal**: Adjust mission difficulty and mode via world-space interactive objects.

**Independent Test**: Interact with Difficulty Pedestal -> State updates to Difficulty 3 -> All party members see update.

### Tests for User Story 3

- [X] T013 [US3] Unit test for difficulty and mode state transitions in `src/server/services/LobbyService.spec.ts`

### Implementation for User Story 3

- [X] T014 [P] [US3] Implement DifficultyPedestalComponent.ts (Cycle 1-5) in `src/client/components/Lobby/DifficultyPedestalComponent.ts`
- [X] T015 [P] [US3] Implement ModeBannerComponent.ts (Toggle Standard/Ironman) in `src/client/components/Lobby/ModeBannerComponent.ts`

---

## Phase 6: User Story 4 - Launch Mission (Priority: P1)

**Goal**: Coordinate multi-player launch ensuring everyone has selected a mercenary.

**Independent Test**: Party members select mercs -> Portal activates -> All members enter portal -> Group deployment starts.

### Tests for User Story 4

- [X] T016 [US4] Integration test for multi-player readiness and launch proximity in `src/server/services/LobbyService.spec.ts`

### Implementation for User Story 4

- [X] T017 [US4] Implement server-side launch proximity and readiness validation in `src/server/services/LobbyService.ts`
- [X] T018 [US4] Implement Portal VFX state synchronization (Active/Inactive) in `src/client/components/Lobby/PortalComponent.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and environment cleanup.

- [X] T019 [P] Verify hub object tagging per `quickstart.md`
- [X] T020 Documentation updates for 3D Hub mechanics
- [X] T021 Final manual test of Solo and Party flows in Studio

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 & 2**: Prerequisites for all world interaction.
- **Phase 3 (US1)**: Must be completed first as the core "Happy Path".
- **Phase 4-6**: Can be worked on in any order after US1, but Phase 6 depends on readiness logic from previous phases.

### User Story Completion Order

1. **US1 (Solo Launch)**: P0 Priority - The MVP.
2. **US2 (Form Party)**: P1 Priority.
3. **US3 (Configure)**: P1 Priority.
4. **US4 (Launch)**: P1 Priority - Completes the co-op loop.

---

## Parallel Example: Foundational Setup

```bash
# Parallel updates to Service and Controller:
Task: "Update LobbyService.ts to support difficulty and isOnPad state in src/server/services/LobbyService.ts"
Task: "Update LobbyController.ts to manage AtStation state and station events in src/client/controllers/LobbyController.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Setup project folders.
2. Implement basic Locker and Portal components.
3. Refactor UI to show only when at a station.
4. **Result**: Player can play solo immediately.

### Incremental Delivery

1. Foundation -> World components ready.
2. US1 -> Solo play ready.
3. US2 -> Co-op joining ready.
4. US3 -> Customization ready.

---

## Phase 8: Hub Polish & Gear Bench (Next Steps)

**Purpose**: Complete the immersive hub vision with loadout modification and visual feedback.

- [x] T022 Implement `GearBenchComponent.ts` in `src/client/components/Lobby/`
- [x] T023 Create `LoadoutEditor.tsx` in `src/client/ui/components/`
- [x] T024 Add visual state synchronization (SurfaceGuis/Attributes) to pedestals and banner
- [x] T025 Implement Gear Bench interaction in `Lobby.tsx`
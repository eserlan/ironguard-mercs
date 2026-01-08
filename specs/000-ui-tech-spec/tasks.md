---
description: "Task list for IronGuard Mercs: UI Technical Requirement (Hybrid)"
---

# Tasks: UI Technical Requirement (Hybrid)

**Input**: Design artifacts from `specs/000-ui-tech-spec/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency management.

- [x] T001 Install React dependencies (`@rbxts/react`, `@rbxts/react-roblox`) using `npm`
- [x] T002 [P] Create `src/client/ui/apps/App.tsx` React root component
- [x] T003 [P] Create `src/client/ui/components` directory for shared components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T004 Implement `HudController` in `src/client/controllers/HudController.ts` to mount React root
- [x] T005 [P] Implement `AppUI` ScreenGui creation logic in `HudController`
- [x] T006 Implement `VFXController` in `src/client/controllers/VFXController.ts` for Native Micro-UI management
- [x] T007 [P] Implement basic `Maid` cleanup in `VFXController`

---

## Phase 3: User Story 1 - Developer Implementation of HUD (Priority: P1)

**Goal**: Validate the React pipeline and Flamework integration.

**Independent Test**: Create a `HudController`. Mount a `<Hud />` component. Change player health value. Verify UI bar updates automatically.

- [x] T008 [US1] Create manual verification script in `test/client/verify_hud.client.ts` to mock player state changes
- [x] T009 [P] [US1] Implement `<Hud />` component in `src/client/ui/apps/Hud.tsx`
- [x] T010 [US1] Wire `HudController` to pass mock state to `<App />` and `<Hud />`
- [x] T011 [US1] Verify React root mounts correctly to `PlayerGui`

---

## Phase 4: User Story 2 - Developer Implementation of Damage Numbers (Priority: P1)

**Goal**: Validate the Native pipeline for performance.

**Independent Test**: Trigger a "damage event" in a loop (10 times/sec). Ensure numbers spawn, animate, and clean up without frame drops.

- [x] T012 [US2] Create manual verification script in `test/client/verify_vfx.client.ts` to spam damage numbers
- [x] T013 [US2] Implement `spawnDamageNumber` method in `src/client/controllers/VFXController.ts`
- [x] T014 [P] [US2] Implement BillboardGui template for Damage Numbers in `src/client/controllers/VFXController.ts` (or asset)
- [x] T015 [US2] Implement TweenService logic for damage number animation (upward float + fade)

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T016 [P] Update `GEMINI.md` with final UI standards (already done via agent update, verify)
- [x] T017 Document `VFXController` API in `specs/000-ui-tech-spec/contracts/` if needed (optional)
- [x] T018 Ensure no Z-index fighting between React and Native layers

---

## Dependencies & Execution Order

1.  **Setup (Phase 1)** and **Foundational (Phase 2)** must be completed first.
2.  **User Story 1** (React HUD) and **User Story 2** (Native VFX) can be executed in parallel after Phase 2.

## Parallel Execution Examples

```bash
# React Developer
Task: "Implement <Hud /> component" (T009)
Task: "Wire HudController to pass mock state" (T010)

# VFX Developer
Task: "Implement spawnDamageNumber method" (T013)
Task: "Implement TweenService logic" (T015)
```

## Implementation Strategy

1.  **Phase 1-2**: Scaffold the empty React root and empty VFX controller.
2.  **Phase 3**: Get a "Hello World" React label on screen.
3.  **Phase 4**: Get a single floating number to spawn and delete itself.

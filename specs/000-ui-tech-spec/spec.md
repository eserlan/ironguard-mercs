# UI Technical Requirement: Hybrid Roblox UI + React

**Status**: Approved
**Owner**: Gemini Agent
**Created**: 2026-01-07
**Feature Branch**: `000-ui-tech-spec`
**Input**: Hybrid UI approach blending React for complexity and Native for performance.

## Summary

This specification defines the "Hybrid UI" architecture for IronGuard Mercs. We will use **React** (`@rbxts/react`) for complex, stateful screens (HUD, Inventory, Menus) to ensure maintainability, while reserving **Native Roblox Instances** (imperative code) for high-frequency, short-lived visual effects (floating damage numbers, hit markers) to ensure maximum performance during combat.

## Problem / Why

Game UI faces two conflicting constraints:
1.  **Complexity**: Systems like Inventories, Skill Trees, and Settings require complex state management. Writing this imperatively leads to "spaghetti code" and bugs.
2.  **Performance**: Combat feedback (damage numbers, reticles) requires high-frequency updates (60fps). React's reconciliation overhead can cause frame drops when handling hundreds of rapid positional updates.

A "one size fits all" approach fails here. Pure React is too slow for particle-like UI; pure Native is too hard to maintain for menus. We need a formalized split.

## Proposal / What

We will adopt a **Hybrid Standard**:

### 1. React for "Screens & Systems"
React must be used for UI that is **Long-lived**, **State-heavy**, or **Layout-complex**.
*   **Examples**: HUD (Health/Ammo), Inventory, Shop, Party Frames, Settings, Match Vote.
*   **Tech**: `@rbxts/react`, `@rbxts/react-roblox`, Flamework Controllers.

### 2. Native Instances for "Micro-UI Effects"
Native imperative code must be used for UI that is **Short-lived**, **High-frequency**, or **"Fire-and-Forget"**.
*   **Examples**: Floating Damage Numbers, Hit Markers, Crit Flashes, Simple Context Prompts.
*   **Tech**: `Instance.new`, `Debris`, `TweenService`, `Maid`.

### User Scenarios & Testing

#### User Story 1 - Developer Implementation of HUD (Priority: P1)
**Description**: A developer needs to implement the player's Health and Ammo bar. This requires listening to character state changes.
**Value**: Validates the React pipeline and Flamework integration.
**Independent Test**: Create a `HudController`. Mount a `<Hud />` component. Change player health value. Verify UI bar updates automatically.

#### User Story 2 - Developer Implementation of Damage Numbers (Priority: P1)
**Description**: A developer needs to show damage numbers when an enemy is hit. These must spawn instantly and animate upwards.
**Value**: Validates the Native pipeline for performance.
**Independent Test**: Trigger a "damage event" in a loop (10 times/sec). Ensure numbers spawn, animate, and clean up without frame drops.

### Requirements

#### Functional
- **FR-001**: System MUST support a React application root for managing persistent screens.
- **FR-002**: System MUST allow imperative spawning of `BillboardGui` or `ScreenGui` elements for transient effects.
- **FR-003**: The React root MUST be a singleton per client, mounted to a persistent `ScreenGui`.
- **FR-004**: React components MUST NOT directly mutate Roblox Instances that they do not own (no "grabbing" global instances).

#### Key Entities
- **AppUI**: The main `ScreenGui` hosting the React Root.
- **MicroUI**: A folder or layer for transient native effects.
- **HudController**: The Flamework controller responsible for mounting the App.

## Technical / How

### Mounting & Ownership (React)
*   **Single Root**: Create one `ScreenGui` named `AppUI` (ResetOnSpawn = false).
*   **Mount Point**: Mount the React application in `client/controllers/HudController.ts` (or `AppController.ts`) using `createRoot`.
*   **Routing**: Use a simple state-based router (e.g., `currentScreen` state) within React to switch between HUD, Inventory, and Menu. Do not create multiple Roots.

### Native Optimization
*   **Pooling**: For high-volume effects like damage numbers, implementation should consider object pooling (part reuse) to avoid GC spikes, though simple `Destroy()` is acceptable for MVP.
*   **Z-Index**: Native effects should generally render *above* the React HUD (or below, depending on design), managed via `DisplayOrder`.

### Forbidden Patterns
*   ❌ **No Mixed Roots**: Do not create a new `React.mount` for every individual button or window.
*   ❌ **No React-controlled Tweens**: Do not use `setState` to animate a health bar every frame. Use `Roact.Binding` or direct ref manipulation for smooth animations within React.

## Risks

- **Consistency**: Developers might be confused about when to use which.
    *   *Mitigation*: Strict code review guidelines (Section "Proposal/What").
- **Performance**: React Context updates causing full-app re-renders.
    *   *Mitigation*: Use specific event subscriptions or granular components.
- **Z-Ordering**: React UI and Native UI overlapping incorrectly.
    *   *Mitigation*: Reserve specific `DisplayOrder` ranges for each layer (e.g., React=10, Native=20).

## Open Questions

- **Q1**: Do we need a dedicated "Router" library?
    *   *Answer*: For now, simple conditional rendering is sufficient.
- **Q2**: Should damage numbers be 3D (Billboard) or 2D (Screen)?
    *   *Answer*: 3D Billboard is standard for "in-world" feedback.

## Success Criteria

- **SC-001**: A unified `AppUI` screen exists and renders a basic text label via React.
- **SC-002**: A function exists to spawn a floating text label that destroys itself after 1s (Native).
- **SC-003**: Both systems can be active simultaneously without errors.
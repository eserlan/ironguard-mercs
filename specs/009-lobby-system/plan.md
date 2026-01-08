# Lobby System - 3D Immersive Implementation Plan

**Status**: Active
**Last Updated**: 2026-01-08

## Technical Context

| Tech | Choice | Notes |
|------|--------|-------|
| Networking | Flamework Networking | Standard for the project. |
| Persistence | N/A (Ephemeral Hub) | Lobby state is runtime-only. |
| Interaction | ProximityPrompts | Contextual interactions in 3D space. |
| Detection | GetPartsInPart | Spatial query for pad detection. |
| UI | React-Roblox | Hybrid HUD and Contextual menus. |

---

## Constitution Check

| Principle | Adherence | Notes |
|-----------|-----------|-------|
| Modular Architecture | ✅ | Flamework components for world objects. |
| Test-Driven Quality | ✅ | Unit tests for party logic; manual integration for 3D. |
| Iterative Delivery | ✅ | Phase-based rollout from infra to world objects. |

---

## Phases

### Phase 1: World Components (Foundational)

**Goal**: Bind logic to 3D parts using Flamework Components.

#### [NEW] [PartyPadComponent.ts](file:///src/client/components/Lobby/PartyPadComponent.ts)
- Bind to `LobbyPartyPad`.
- Cycle detection every 0.5s via `GetPartsInPart`.
- Call `LobbyController.createParty()` / `joinParty()`.

#### [NEW] [PortalComponent.ts](file:///src/client/components/Lobby/PortalComponent.ts)
- Bind to `LobbyDungeonPortal`.
- Detect character touch.
- Call `LobbyController.launchMission()`.

#### [NEW] [StationComponent.ts](file:///src/client/components/Lobby/StationComponent.ts)
- Base for Locker, Gear Bench, Pedestals.
- Manages `ProximityPrompt` lifecycle.

---

### Phase 2: Controller & Service Updates

**Goal**: Support 3D state in the backend.

#### [MODIFY] [LobbyService.ts](file:///src/server/services/LobbyService.ts)
- Handle `isOnPad` state updates.
- Update `launchMission` to validate physical proximity to portal.
- Implement `SetDifficulty` logic.

#### [MODIFY] [LobbyController.ts](file:///src/client/controllers/LobbyController.ts)
- Handle contextual UI opening/closing.
- Manage "In Station" state.

---

### Phase 3: UI & VFX

**Goal**: Visual feedback for the 3D hub.

#### [NEW] [LobbyBillboard.tsx](file:///src/client/ui/components/LobbyBillboard.tsx)
- React component mounted to `PartyPad` center.
- Displays Room Code and Party List.

#### [MODIFY] [Lobby.tsx](file:///src/client/ui/apps/Lobby.tsx)
- Switch from fullscreen to contextual rendering.

---

### Phase 4: Ability Selection & Gameplay HUD

**Goal**: Allow players to choose abilities and see them in-game.

#### Ability Registration
- Added `getAll()` to `AbilityRegistry`.
- Updated `ClassController` to register class-specific abilities.

#### [NEW] [AbilitySelector.tsx](file:///src/client/ui/components/AbilitySelector.tsx)
- Grid UI for selecting 4 abilities.
- Displays TOP/BOTTOM cooldowns.

#### [NEW] [AbilityBar.tsx](file:///src/client/ui/AbilityBar.tsx)
- Gameplay HUD component.
- Visual cooldown tracking via `useAbilityCooldowns` hook.

---

## Verification Plan

### Manual Verification
1. Verify `PartyPad` auto-joins party on stand.
2. Verify `Locker` opens selection UI via ProximityPrompt.
3. Verify `Portal` launches mission only when all ready.

### Automation
- Unit tests for `LobbyService` room management.
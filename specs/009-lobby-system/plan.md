# Lobby System - Sanctuary of Valor Implementation Plan

**Status**: Implemented (Refined)
**Last Updated**: 2026-01-08

## Technical Context

| Tech | Choice | Notes |
|------|--------|-------|
| Networking | Flamework Networking | Standard authoritative events. |
| Interaction | ProximityPrompts | Physical station interactions. |
| Detection | GetPartsInPart | Spatial query for Circle of Unity. |
| UI | React-Roblox | Hybrid HUD and Parchment-style menus. |
| VFX | ParticleEmitters | Pillar of light and celestial gate effects. |

---

## Constitution Alignment

| Principle | Adherence | Notes |
|-----------|-----------|-------|
| Pure Game Logic | ✅ | Algorithms in `shared/algorithms/party`. |
| Top/Bottom Ability | ✅ | Server-side validation with client-side HUD. |
| UI Safety | ✅ | No React Fragments used in `AbilityBar` or `Lobby`. |

---

## Phases

### Phase 1: Sanctuary Components (Completed)

**Goal**: Bind logic to the high-fantasy sanctuary objects.

#### [NEW] [CircleOfUnityComponent.ts](file:///src/client/components/Lobby/CircleOfUnityComponent.ts)
- Binds to `LobbyCircleOfUnity`.
- Triggers `StepOnPad` / `StepOffPad` for co-op formation.

#### [NEW] [TheGreatGateComponent.ts](file:///src/client/components/Lobby/TheGreatGateComponent.ts)
- Binds to `LobbyTheGreatGate`.
- Visual opening/glow when party is ready.

#### [NEW] [Station Base](file:///src/client/components/Lobby/StationComponent.ts)
- Refined base class supporting `Roster Altar`, `Healing Fountain`, and `Tome of Whispers`.

---

### Phase 2: Spiritual Interactions (Completed)

**Goal**: Implement the pillar and altars.

#### [NEW] [PillarOfFateComponent.ts](file:///src/client/components/Lobby/PillarOfFateComponent.ts)
- Dynamic surface UI showing current difficulty (I-V).
- Floating billboard with thematic descriptions.

#### [NEW] [BlackBellComponent.ts](file:///src/client/components/Lobby/BlackBellComponent.ts)
- Striking the bell toggles Ironman mode with red visual feedback.

#### [NEW] [RosterAltarComponent.ts](file:///src/client/components/Lobby/RosterAltarComponent.ts)
- Surface buttons for hero selection (Pledging).
- Detailed hero stat billboard.

---

### Phase 3: The Tome & The Font (Completed)

**Goal**: Ability and Gear customization.

#### [NEW] [TomeOfWhispersComponent.ts](file:///src/client/components/Lobby/TomeOfWhispersComponent.ts)
- Opens the refined `AbilitySelector` with technical variant details.

#### [NEW] [HealingFountainComponent.ts](file:///src/client/components/Lobby/HealingFountainComponent.ts)
- Triggers the `LoadoutEditor` for equipment modification.

---

## Verification Plan

### Manual Studio Test
1. **Pledging**: Select hero at Roster Altar -> Confirm Billboard updates.
2. **Unity**: Step into Circle -> Room Code appears -> Pillar of Light visual.
3. **The Gate**: All members pledge -> Gate glows -> Walk through -> Mission starts.

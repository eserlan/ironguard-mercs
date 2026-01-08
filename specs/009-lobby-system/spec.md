# Lobby System: The Sanctuary of Valor

**Status**: Implemented (Refined)
**Owner**: Espen
**Created**: 2026-01-08
**Feature Branch**: `009-lobby-system`
**Input**: High-fantasy pre-mission hub for party formation and spiritual preparation.

## Summary

The Lobby System is physically realized as **The Sanctuary of Valor**, a mountain-top cathedral where mercenaries gather to prepare for tactical operations. It replaces traditional flat menus with immersive, diegetic interactions: pledging at altars, touching the pillar of fate, and stepping through the Great Gate.

## Problem / Why

Players need a cohesive, atmospheric interface to:
1. Form or join co-op parties (1-4 players).
2. Select a mercenary hero to deploy (attunement).
3. Configure ability loadouts (consulting the tome).
4. Configure gear loadout (ritual at the fountain).
5. Choose mission difficulty and mode (Standard vs Ironman).
6. Coordinate deployment into procedural dungeons.

## Proposal / What

### Immersive 3D Hub: The Sanctuary

Preparations are performed at dedicated stations within the cathedral grounds.

| Element | Function | Interaction |
|---------|----------|-------------|
| **Circle of Unity** | Group formation (1-4 players) | Stand on mosaic → pillar of light descends |
| **The Great Gate** | Mission launch | Ivory doors open to celestial clouds when ready |
| **Pillar of Fate** | Set mission difficulty (1-5) | ProximityPrompt at crystal → cycle intensity |
| **Black Bell** | Toggle Ironman Mode | Strike the dark bell to make a blood pact |
| **Roster Altar** | Select mercenary hero | "Pledge" at hero statue → character attunement |
| **Tome of Whispers**| Configure 4-slot ability loadout | Interact with floating book → parchment UI |
| **Healing Fountain**| View/modify gear loadout | ProximityPrompt at glowing font → gear UI |

### Hub Layout

```
     ┌─────────────────────────────────────────┐
     │             THE GREAT GATE              │
     │         (ivory doors, celestial)        │
     └─────────────────────────────────────────┘
                         │
     ┌──────────────────┼──────────────────┐
     │   PILLAR OF      │    BLACK BELL    │
     │   FATE (1-5)     │    (IRONMAN)     │
     └──────────────────┼──────────────────┘
                         │
     ┌──────────────────┴──────────────────┐
     │                                      │
     │          CIRCLE OF UNITY             │
     │       (marble mosaic, 4 spots)       │
     │                                      │
     └──────────────────────────────────────┘
                         │
     ┌─────────┬────────┴────────┬─────────┐
     │ ROSTER  │     CLOISTER    │ TOME OF │
     │ ALTAR   │      (SPAWN)    │ WHISPERS│
     └─────────┴─────────────────┴─────────┘
                         │
                  ┌──────┴──────┐
                  │ HEALING FONT│
                  └─────────────┘
```

(The Ability Terminal allows players to tweak their ability choices without re-selecting their class at the Locker).

### Out of Scope

- Public matchmaking queue
- Voice chat integration
- Spectator mode
- Party persistence across sessions
- Mission Board / Contract selection

### User Scenarios & Testing

#### User Story 1 - Solo Quick Launch (Priority: P0)
**Description**: A solo player spawns in the Cloister, pledges a hero at the Altar, and walks through the Great Gate.
**Acceptance Criteria**:
- Player spawns at hub spawn point.
- Player interacts with Roster Altar → selection UI opens.
- Player walks through Great Gate → mission starts.

#### User Story 2 - Form Party (Priority: P1)
**Description**: Multiple players stand on the Circle of Unity mosaic to automatically form a group.
**Acceptance Criteria**:
- Stepping into the mosaic auto-joins the first available party.
- Room code appears on a BillboardGui above the mosaic.
- Stepping out of the mosaic leaves the party.

#### User Story 3 - Configure Mission (Priority: P1)
**Description**: Party leader adjusts difficulty by touching the Pillar of Fate and mode by striking the Black Bell.
**Acceptance Criteria**:
- Pillar of Fate cycles difficulty 1-5; crystal color updates (Green to Purple).
- Black Bell toggles Standard/Ironman; colors update (Blue to Red).

### Requirements

#### Functional

- **FR-001**: System MUST allow solo players to launch missions without party formation.
- **FR-002**: System MUST auto-create party when first player enters the Circle of Unity.
- **FR-003**: System MUST synchronize party state across all members.
- **FR-004**: System MUST enforce mercenary selection before Gate entry.
- **FR-005**: Great Gate MUST only activate (open visual effects and disable physical `CanCollide` property) when all members are ready. Inactive gates MUST physically block entry.
- **FR-006**: Pillar of Fate MUST cycle difficulty 1-5 on interact.
- **FR-007**: Black Bell MUST toggle Standard/Ironman on interact.
- **FR-008**: System MUST clean up party state when all players leave the mosaic.
- **FR-009**: Players MUST be able to configure a 4-slot ability loadout at the Tome of Whispers.
- **FR-010**: Gameplay HUD MUST display equipped abilities with real-time cooldown visualization.

#### Hub Components

- **CircleOfUnityComponent**: Detects players on mosaic, manages light pillars.
- **TheGreatGateComponent**: Validates readiness, triggers celestial launch.
- **PillarOfFateComponent**: ProximityPrompt to cycle difficulty with visual feedback.
- **BlackBellComponent**: ProximityPrompt to toggle Ironman pact.
- **RosterAltarComponent**: ProximityPrompt/SurfaceButtons to pledge a hero.
- **TomeOfWhispersComponent**: ProximityPrompt to open ability selection parchment.
- **HealingFountainComponent**: ProximityPrompt to open gear loadout font.

## Technical / How

### Architecture

The system uses **Flamework Components** to bind logic to 3D parts tagged in the Workspace. Communication flows through `LobbyController` (Client) to `LobbyService` (Server).

### UI Strategy: Hybrid Diegetic
- **Contextual Overlays**: Roster and Tome UIs use a parchment aesthetic, appearing as if the player is reading in-world.
- **World-Space HUD**: Room codes and player status are rendered via `BillboardGuis` attached to hub objects.

### Security
- **Launch Validation**: Server validates player proximity to The Great Gate and readiness state before allowing mission start.

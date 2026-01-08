# Lobby System

**Status**: Draft
**Owner**: Espen
**Created**: 2026-01-08
**Feature Branch**: `009-lobby-system`
**Input**: Pre-mission hub for party formation and deployment.

## Summary

The Lobby System provides the pre-mission hub where players prepare for tactical operations. It handles party formation, mercenary selection, gear loadout, and mission mode selection before deploying into procedural dungeons.

## Problem / Why

Players need a cohesive interface to:
1. Form or join co-op parties (1-4 players)
2. Select which mercenary from their roster to deploy
3. Configure gear loadout before missions
4. Choose mission difficulty and mode (Standard vs Ironman)
5. Launch into missions with their squad

Without a dedicated lobby system, players cannot coordinate before missions, breaking the core co-op experience defined in Spec 001.

## Proposal / What

### Immersive 3D Hub

The lobby is a **physical 3D hub world** where players interact with the environment to form parties and launch missions. No flat menu screens—players walk up to interactive stations.

| Element | Function | Interaction |
|---------|----------|-------------|
| **Party Pad** | Group formation (1-4 players) | Stand on pad → auto-join party |
| **Dungeon Portal** | Mission launch | Walk through when party ready |
| **Difficulty Pedestal** | Set mission difficulty (1-5) | ProximityPrompt → cycle difficulty |
| **Mode Banner** | Toggle Standard/Ironman | ProximityPrompt → toggle mode |
| **Mercenary Locker** | Select mercenary from roster | ProximityPrompt → open selection UI |
| **Ability Terminal** | Configure 4-slot ability loadout | ProximityPrompt → open ability selection UI for current class |
| **Gear Bench** | View/modify gear loadout | ProximityPrompt → open gear loadout UI |

### Hub Layout

```
     ┌─────────────────────────────────────────┐
     │            DUNGEON PORTAL               │
     │         (glowing, animated)             │
     └─────────────────────────────────────────┘
                        │
     ┌──────────────────┼──────────────────┐
     │   DIFFICULTY     │     MODE         │
     │   PEDESTAL       │     BANNER       │
     └──────────────────┼──────────────────┘
                        │
     ┌──────────────────┴──────────────────┐
     │                                      │
     │           PARTY PAD                  │
     │      (circular, 4 spots)             │
     │                                      │
     └──────────────────────────────────────┘
                        │
     ┌─────────┬────────┴────────┬─────────┐
     │ LOCKER  │     SPAWN       │ ABILITY │
     │  ROOM   │     POINT       │ TERMINAL│
     └─────────┴─────────────────┴─────────┘
                        │
                 ┌──────┴──────┐
                 │  GEAR BENCH │
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
**Description**: A solo player spawns in the hub, selects a mercenary at the Locker, and walks through the Portal.
**Value**: Core entry point for single-player testing and casual play.
**Acceptance Criteria**:
- Player spawns at hub spawn point
- Player interacts with Mercenary Locker → selection UI opens
- Player walks through Dungeon Portal → mission starts
- Mission spawns with selected mercenary

#### User Story 2 - Form Party (Priority: P1)
**Description**: Multiple players stand on the Party Pad to automatically form a group.
**Value**: Enables co-op gameplay coordination.
**Acceptance Criteria**:
- First player on Party Pad creates party, sees room code above pad
- Additional players stepping on pad auto-join
- Players see party member list HUD
- Stepping off pad → leaves party

#### User Story 3 - Configure Mission (Priority: P1)
**Description**: Party leader adjusts difficulty and mode using hub pedestals.
**Value**: Allows customization before deployment.
**Acceptance Criteria**:
- Interact with Difficulty Pedestal → cycles difficulty 1-5
- Interact with Mode Banner → toggles Standard/Ironman
- All party members see updated settings in HUD

#### User Story 4 - Launch Mission (Priority: P1)
**Description**: All party members walk through the Portal together.
**Value**: Coordinates squad deployment.
**Acceptance Criteria**:
- Each player must have selected a mercenary (via Locker)
- Portal glows/activates only when all members are ready
- Walking through Portal triggers mission launch for entire party
- Mission spawns all party members together

### Requirements

#### Functional

- **FR-001**: System MUST allow solo players to launch missions without party formation.
- **FR-002**: System MUST auto-create party when first player steps on Party Pad.
- **FR-003**: System MUST synchronize party state (players, mode, difficulty) across all members.
- **FR-004**: System MUST enforce mercenary selection before portal entry.
- **FR-005**: Portal MUST only activate (enable physical touch-trigger and visual glow) when all party members have selected mercenaries.
- **FR-006**: Difficulty Pedestal MUST cycle difficulty 1-5 on interact.
- **FR-007**: Mode Banner MUST toggle Standard/Ironman on interact.
- **FR-008**: System MUST clean up party state when all players leave pad.
- **FR-009**: Players MUST be able to configure a 4-slot ability loadout from their class library.
- **FR-010**: Gameplay HUD MUST display equipped abilities with real-time cooldown visualization (TOP/BOTTOM sharing cooldown).

#### Hub Components

- **PartyPadComponent**: Detects players standing on pad, manages auto-join/leave.
- **DungeonPortalComponent**: Validates readiness, triggers mission launch.
- **DifficultyPedestalComponent**: ProximityPrompt to cycle difficulty.
- **ModeBannerComponent**: ProximityPrompt to toggle mode.
- **MercenaryLockerComponent**: ProximityPrompt to open mercenary selection UI.
- **AbilityTerminalComponent**: ProximityPrompt to open ability selection UI.
- **GearBenchComponent**: ProximityPrompt to open gear loadout UI.

#### Key Entities

- **LobbyState**: Current state of the lobby (Idle, InParty, Ready, Launching).
- **PartyRoom**: Server-side representation of a party (code, host, members, mode, difficulty).
- **PartyMember**: Player info within a party (playerId, selectedMerc, isOnPad).

## Technical / How

### Architecture

```
┌──────────────┐       ┌───────────────┐       ┌─────────────────┐
│ LobbyUI      │──────▶│ LobbyController│──────▶│ LobbyService    │
│ (React)      │◀──────│ (Client)       │◀──────│ (Server)        │
└──────────────┘       └───────────────┘       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ GlobalEvents    │
                       │ (Networking)    │
                       └─────────────────┘
```

### Components

1. **LobbyService** (Server): Manages party rooms, validates joins, orchestrates launches
2. **LobbyController** (Client): Handles UI state, sends intents to server
3. **LobbyUI** (React): Mercenary selection, party display, ready/launch buttons

### Networking Events

**ClientToServer**:
- `CreateParty()`: Request new party room
- `JoinParty(code: string)`: Join existing room
- `LeaveParty()`: Exit current room
- `SelectMercenary(mercId: string)`: Choose mercenary
- `SetReady(ready: boolean)`: Toggle ready state
- `LaunchMission()`: Host initiates mission start

**ServerToClient**:
- `PartyCreated(code: string)`: Room created with code
- `PartyJoined(roomState: PartyRoom)`: Successfully joined
- `PartyUpdated(roomState: PartyRoom)`: State changed (members, ready, etc.)
- `PartyLeft()`: Removed from party
- `MissionLaunching(seed: number)`: Mission is starting

## Risks

- **Host Migration**: If host (first on pad) leaves, party ownership transfers to next player.
- **Pad Overflow**: 5th player cannot step on pad; bounced back with feedback.
- **Stale State**: Clients may show outdated party state if events are missed.

## Success Criteria

- **SC-001**: Solo player can walk spawn→locker→portal in under 10 seconds.
- **SC-002**: Two players on Party Pad see each other in party HUD.
- **SC-003**: Party state sync verified with 4-player stress test.
- **SC-004**: Portal only activates when all members have selected mercenaries.

## Open Questions

- Should room code be displayed above the Party Pad for invite purposes?
- How to visually indicate mercenary selection status per player (glow, icon)?

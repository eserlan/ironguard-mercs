# Lobby System

**Status**: Draft
**Owner**: Gemini Agent
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

### MVP Scope

For the initial implementation, the lobby supports:
- **Single-player quick start**: Solo players can immediately select a mercenary and launch
- **Party formation**: Host creates a room, others join via code or invite
- **Mercenary selection**: Pick one mercenary from your roster to deploy
- **Loadout preview**: View equipped gear (modification deferred to Spec 008)
- **Mission mode selection**: Standard or Ironman mode
- **Ready-up & launch**: All players must ready before host can launch

### Out of Scope (MVP)

- Public matchmaking queue
- Voice chat integration
- Spectator mode
- Party persistence across sessions

### User Scenarios & Testing

#### User Story 1 - Solo Quick Launch (Priority: P0)
**Description**: A solo player enters the lobby, selects a mercenary, and immediately launches a mission.
**Value**: Core entry point for single-player testing and casual play.
**Acceptance Criteria**:
- Player sees mercenary selection UI
- Player can select a mercenary from their roster
- Player can click "Launch" to start a mission
- Mission starts with the selected mercenary

#### User Story 2 - Create Party (Priority: P1)
**Description**: A host creates a party room with a unique code. Other players can join using this code.
**Value**: Enables co-op gameplay coordination.
**Acceptance Criteria**:
- Host clicks "Create Party" and receives a room code
- Room code is displayed prominently
- Room shows connected players as they join
- Host can kick players from the room

#### User Story 3 - Join Party (Priority: P1)
**Description**: A player enters a room code to join an existing party.
**Value**: Allows friends to group up for co-op.
**Acceptance Criteria**:
- Player enters room code in join dialog
- Invalid codes show error message
- Valid codes add player to the room
- Player sees other party members

#### User Story 4 - Ready & Launch (Priority: P1)
**Description**: All party members select mercenaries and ready up. Host launches the mission.
**Value**: Coordinates squad deployment.
**Acceptance Criteria**:
- Each player selects a mercenary
- Players click "Ready" to indicate readiness
- Host sees ready status for all players
- "Launch" button is enabled only when all players are ready
- Launch starts mission for all party members

### Requirements

#### Functional

- **FR-001**: System MUST allow solo players to launch missions without party formation.
- **FR-002**: System MUST generate unique room codes for party creation.
- **FR-003**: System MUST synchronize party state (players, ready status) across all members.
- **FR-004**: System MUST enforce mercenary selection before ready-up.
- **FR-005**: System MUST only allow mission launch when all players are ready.
- **FR-006**: System MUST support Standard and Ironman mode selection at party level.
- **FR-007**: System MUST clean up party state when host disconnects.

#### Key Entities

- **LobbyState**: Current state of the lobby (Idle, InParty, Ready, Launching).
- **PartyRoom**: Server-side representation of a party (code, host, members, mode).
- **PartyMember**: Player info within a party (playerId, selectedMerc, isReady).

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

- **Host Migration**: If host disconnects, party is lost (acceptable for MVP).
- **Code Collisions**: Room codes must be unique server-wide.
- **Stale State**: Clients may show outdated party state if events are missed.

## Success Criteria

- **SC-001**: Solo player can launch mission within 3 clicks from lobby entry.
- **SC-002**: Two players can form a party and launch together using room code.
- **SC-003**: Party state sync verified with 4-player stress test.
- **SC-004**: Mercenary selection correctly persists to mission spawn.

## Open Questions

- None at this time.

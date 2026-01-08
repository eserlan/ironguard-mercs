# Lobby System - Implementation Plan

**Status**: Draft
**Last Updated**: 2026-01-08

## Overview

This plan outlines the phased implementation of the Lobby System (Spec 009). The lobby provides the pre-mission hub for party formation, mercenary selection, and mission launch.

---

## Phase 1: Core Infrastructure

**Goal**: Establish networking events and server-side party management.

### 1.1 Networking Events

#### [MODIFY] [net.ts](file:///home/espen/proj/ironguard-mercs/src/shared/net.ts)

Add lobby-specific events to `ClientToServerEvents` and `ServerToClientEvents`:

```typescript
// ClientToServerEvents
CreateParty(): void;
JoinParty(code: string): void;
LeaveParty(): void;
SelectMercenary(mercId: string): void;
SetReady(ready: boolean): void;
SetMissionMode(mode: string): void;
LaunchMission(): void;

// ServerToClientEvents
PartyCreated(code: string): void;
PartyJoined(roomState: PartyRoom): void;
PartyUpdated(roomState: PartyRoom): void;
PartyLeft(): void;
MissionLaunching(seed: number): void;
```

### 1.2 Shared Types

#### [NEW] [party-types.ts](file:///home/espen/proj/ironguard-mercs/src/shared/domain/party/party-types.ts)

Define party-related types:
- `LobbyState` enum
- `PartyRoom` interface
- `PartyMember` interface

### 1.3 Server Service

#### [NEW] [LobbyService.ts](file:///home/espen/proj/ironguard-mercs/src/server/services/LobbyService.ts)

Server-side party management:
- `createParty(host: Player)`: Generate room, return code
- `joinParty(player: Player, code: string)`: Validate and add to room
- `leaveParty(player: Player)`: Remove from room
- `selectMercenary(player: Player, mercId: string)`: Update selection
- `setReady(player: Player, ready: boolean)`: Toggle ready state
- `setMissionMode(player: Player, mode: string)`: Update mode (Host only)
- `launchMission(host: Player)`: Validate host & all ready, trigger mission start

---

## Phase 2: Client Controller

**Goal**: Client-side state management and server communication.

### 2.1 Lobby Controller

#### [NEW] [LobbyController.ts](file:///home/espen/proj/ironguard-mercs/src/client/controllers/LobbyController.ts)

Client-side lobby state:
- Subscribe to server events
- Maintain local party state (synchronized from server)
- Expose state to React UI via observable pattern

---

## Phase 3: React UI

**Goal**: Build lobby interface components.

### 3.1 Lobby Screen

#### [NEW] [Lobby.tsx](file:///home/espen/proj/ironguard-mercs/src/client/ui/apps/Lobby.tsx)

Main lobby container:
- Shows mercenary selection grid
- Shows party panel (if in party)
- Solo launch button or party controls

### 3.2 Party Panel

#### [NEW] [PartyPanel.tsx](file:///home/espen/proj/ironguard-mercs/src/client/ui/components/PartyPanel.tsx)

Party management UI:
- Display room code
- Mission Mode selector (Standard/Ironman) (Host only)
- List party members with ready status
- Ready/Launch buttons

### 3.3 Mercenary Selector

#### [NEW] [MercenarySelector.tsx](file:///home/proj/ironguard-mercs/src/client/ui/components/MercenarySelector.tsx)

Roster display for selection:
- Grid of mercenary cards
- Selection highlight
- Basic stats preview

---

## Phase 4: Integration

**Goal**: Connect lobby to mission launch flow.

### 4.1 Mission Launch Integration

- Hook into existing `RunService` from Spec 001
- Pass selected mercenary and mode to mission start
- Handle multi-player spawn coordination

---

## Verification Plan

### Unit Tests

1. **Party code generation** (pure function):
   ```bash
   npm test -- --filter="party"
   ```

2. **Party state transitions** (pure logic):
   - Create → Join → Ready → Launch flow

### Integration Tests

1. **Roblox Studio manual test**:
   - Start Rojo: `npm run rojo:serve`
   - Open Studio, connect Rojo
   - Verify lobby UI appears
   - Test solo launch flow
   - Test with second client for party flow

### Manual Verification (User)

1. **Solo flow**: Open game → See lobby → Select mercenary → Click Launch → Mission starts
2. **Party flow**: Create party → Share code → Other player joins → Both ready → Launch → Both in mission

---

## Dependencies

- **Spec 001**: RunService, MatchState integration
- **Spec 005**: Player class data for mercenary display
- **Spec 008**: Gear display in loadout preview

# Lobby System - Tasks

**Last Updated**: 2026-01-08

## Phase 1: Core Infrastructure

- [X] Add lobby networking events to `net.ts`
- [X] Create `shared/domain/party/party-types.ts`
- [X] Create `server/services/LobbyService.ts`
  - [X] Implement party room storage
  - [X] Implement `createParty` with unique code generation
  - [X] Implement `joinParty` with validation
  - [X] Implement `leaveParty` with cleanup
  - [X] Implement `selectMercenary`
  - [X] Implement `setReady`
  - [X] Implement `setMissionMode` (Host only check)
  - [X] Implement `launchMission` with all-ready check
- [X] Add party code generation algorithm to `shared/algorithms/party/`
- [X] Write unit tests for party code generation

## Phase 2: Client Controller

- [X] Create `client/controllers/LobbyController.ts`
  - [X] Subscribe to all lobby events
  - [X] Maintain observable party state
  - [X] Expose actions (create, join, ready, launch)
- [X] Create lobby state module for React

## Phase 3: React UI

- [X] Create `client/ui/apps/Lobby.tsx` main container
- [X] Create `client/ui/components/MercenarySelector.tsx`
  - [X] Grid layout for roster
  - [X] Selection state management
  - [X] Basic stat & gear list preview
- [X] Create `client/ui/components/PartyPanel.tsx`
  - [X] Room code display
  - [X] Mission Mode selector (Host only)
  - [X] Player list with ready indicators
  - [X] Ready/Launch buttons
- [X] Wire UI to LobbyController

## Phase 4: Integration

- [X] Connect LobbyService to RunService
- [X] Pass mercenary selection to mission spawn
- [X] Handle party disconnect during mission

## Verification

- [ ] Manual test: Solo quick launch
- [ ] Manual test: Party formation with room code
- [ ] Unit tests for party algorithms pass

# Lobby System - Data Model

## Entities

### PartyRoom

Server-side representation of a party lobby.

```typescript
interface PartyRoom {
    code: string;           // Unique 6-char alphanumeric code
    hostId: string;         // UserId of party host
    mode: MissionMode;      // Standard or Ironman
    members: PartyMember[]; // Max 4 players
    createdAt: number;      // Timestamp for cleanup
}
```

### PartyMember

Player info within a party room.

```typescript
interface PartyMember {
    playerId: string;           // Player.UserId as string
    displayName: string;        // Player.DisplayName
    selectedMercenaryId?: string; // ID from roster, undefined if not selected
    isReady: boolean;           // Ready to launch
}
```

### LobbyState (Client)

Client-side state enum for UI rendering.

```typescript
enum LobbyState {
    Idle = "Idle",           // Not in a party
    Creating = "Creating",   // Waiting for CreateParty response
    Joining = "Joining",     // Waiting for JoinParty response
    InParty = "InParty",     // In a party, not ready
    Ready = "Ready",         // In a party, ready
    Launching = "Launching", // Mission is starting
}
```

### MissionMode

Shared enum for mission type selection.

```typescript
enum MissionMode {
    Standard = "Standard",
    Ironman = "Ironman",
}
```

## Room Code Format

- 6 uppercase alphanumeric characters (A-Z, 0-9)
- Excludes confusing characters: O, 0, I, 1, L
- Example: `ABC123`, `XYZ987`
- Collision probability < 0.001% for < 1000 active rooms

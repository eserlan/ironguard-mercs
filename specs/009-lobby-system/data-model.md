# Lobby System - Data Model

## Entities

### PartyRoom

Server-side representation of a party lobby.

```typescript
interface PartyRoom {
    code: string;           // Unique 6-char alphanumeric code
    hostId: string;         // UserId of party host
    mode: MissionMode;      // Standard or Ironman
    difficulty: number;     // 1-5 (New for 3D Spec)
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
    selectedMercenaryId?: string; // ID from roster
    isReady: boolean;           // Ready to launch
    isOnPad: boolean;           // Currently standing on PartyPad (New for 3D Spec)
}
```

### LobbyState (Client)

Client-side state enum for UI rendering.

```typescript
enum LobbyState {
    Idle = "Idle",           
    AtStation = "AtStation", // Interacting with Locker/Gear/Terminal
    InParty = "InParty",     
    Ready = "Ready",         
    Launching = "Launching", 
}
```

### AbilityLoadout

Representation of equipped abilities.

```typescript
interface EquippedSlot {
    slotIndex: number; // 1-4
    abilityId: string;
}

type AbilityLoadout = EquippedSlot[];
```

### LobbyUiState

Extended state for the client controller.

```typescript
interface LobbyUiState {
    status: LobbyState;
    activeStation?: "Locker" | "Bench" | "Terminal";
    room?: PartyRoom;
    soloMercenaryId?: string;
    abilityLoadout: AbilityLoadout;
    unlockedClassIds: string[];
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
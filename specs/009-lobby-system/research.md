# Lobby System - Research & Technical Decisions

## Decision: Player Detection on Party Pad
- **Choice**: `Workspace:GetPartsInPart()` (Spatial Query API).
- **Rationale**: More performant and reliable than `.Touched` for persistent "standing on" detection. Allows for a specific volume check.
- **Alternatives considered**: 
  - `.Touched`: Prone to physics glitches and requires debouncing.
  - `ZonePlus`: Great library but adds an external dependency we might not need for a simple pad.

## Decision: Component-to-UI Communication
- **Choice**: Components inject `LobbyController` and call specific activation methods.
- **Rationale**: Keeps world-space logic (ProximityPrompts) connected to client-side state management without tight coupling to React directly.
- **Alternatives considered**:
  - `GlobalEvents`: Overkill for local client communication.

## Decision: Interaction Handling
- **Choice**: `ProximityPrompt` for all interactive objects (Locker, Pedestal, Banner).
- **Rationale**: Standard Roblox interaction pattern, highly accessible, and easy to bind to Flamework components.
- **Alternatives considered**:
  - ClickDetectors: Harder to use on mobile/console.

## Decision: Room Code Visibility
- **Choice**: `BillboardGui` attached to the `PartyPad` center piece.
- **Rationale**: Provides immediate feedback in the 3D world without requiring the player to check a 2D menu.

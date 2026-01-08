# Lobby System - Quickstart & Integration

## Setting up the 3D Hub in Studio

To enable the 3D hub, you must create parts in the `Workspace` and tag them using the `CollectionService`.

### Required Tags & Objects

| Tag | Object Type | Purpose |
|-----|-------------|---------|
| `LobbyPartyPad` | `BasePart` | Player detection volume for joining parties. |
| `LobbyDungeonPortal` | `BasePart` | Collision volume for mission launch. |
| `LobbyMercenaryLocker` | `BasePart` | ProximityPrompt point for Mercenary Selection. |
| `LobbyGearBench` | `BasePart` | ProximityPrompt point for Gear/Loadout. |
| `LobbyDifficultyPedestal` | `BasePart` | ProximityPrompt point for Difficulty selection. |
| `LobbyModeBanner` | `BasePart` | ProximityPrompt point for Mission Mode selection. |

## Development Workflow

1.  **Tagging**: Use the "Tag Editor" plugin or `CollectionService:AddTag()` on parts.
2.  **Logic**: Flamework components will automatically bind to these parts.
3.  **UI**: Contextual UIs will open when interacting with `ProximityPrompts`.

## Manual Testing Steps

1.  **Solo Launch**:
    - Spawn in Hub.
    - Walk to `Locker` -> Press E -> Select Mercenary -> Close UI.
    - Walk to `DungeonPortal` -> Walk through -> Mission starts.

2.  **Party Formation**:
    - Player A stands on `PartyPad` -> Room code appears.
    - Player B stands on `PartyPad` -> Joins Player A's party.
    - Both select mercenaries.
    - Both walk into `DungeonPortal` -> Mission starts for both.

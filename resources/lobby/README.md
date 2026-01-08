# Lobby Assets

This folder contains scripts and resources for the Lobby System (Spec 009).

## Quick Setup

### Option 1: Run in Roblox Studio Command Bar

1. Open Roblox Studio with the project
2. Open View → Command Bar
3. Copy the contents of `create-lobby-assets.lua`
4. Paste into Command Bar and press Enter
5. Assets will be generated in `Workspace.Lobby`

### Option 2: Run as Plugin

1. Copy `create-lobby-assets.lua` to your Plugins folder
2. Restart Studio
3. Run the plugin from the Plugins tab

## Generated Assets

| Asset | Location | Tag | Purpose |
|-------|----------|-----|---------|
| LobbySpawn | Workspace.Lobby | `LobbySpawn` | Player spawn point |
| MercenaryLocker.Locker | Workspace.Lobby | `LobbyMercenaryLocker` | Select mercenary UI trigger |
| GearBench.Table | Workspace.Lobby | `LobbyGearBench` | Loadout modification UI trigger |
| PartyPad.Platform | Workspace.Lobby | `LobbyPartyPad` | 4-player party formation area |
| PlayerSpot1-4 | PartyPad children | `LobbyPartySpot` | Individual standing spots |
| DifficultyPedestal.Crystal | Workspace.Lobby | `LobbyDifficultyPedestal` | Cycle difficulty 1-5 |
| ModeBanner.Banner | Workspace.Lobby | `LobbyModeBanner` | Toggle Standard/Ironman |
| DungeonPortal.PortalCenter | Workspace.Lobby | `LobbyDungeonPortal` | Mission launch trigger |

## Layout

```
     ┌─────────────────────────────────────────┐
     │            DUNGEON PORTAL               │  Z = -10
     │         (glowing, animated)             │
     └─────────────────────────────────────────┘
                        │
     ┌──────────────────┼──────────────────┐
     │   DIFFICULTY     │     MODE         │    Z = 5
     │   PEDESTAL       │     BANNER       │
     │   X = -12        │     X = 12       │
     └──────────────────┼──────────────────┘
                        │
     ┌──────────────────┴──────────────────┐
     │                                      │
     │           PARTY PAD                  │    Z = 15
     │      (circular, 4 spots)             │
     │                                      │
     └──────────────────────────────────────┘
                        │
     ┌─────────┬────────┴────────┬─────────┐
     │ LOCKER  │     SPAWN       │  GEAR   │    Z = 35-40
     │ X = -12 │     X = 0       │  X = 12 │
     └─────────┴─────────────────┴─────────┘
```

## CollectionService Tags

The script adds CollectionService tags to all interactive elements. Use these tags in Flamework components:

```typescript
@Component({ tag: "LobbyMercenaryLocker" })
export class MercenaryLockerComponent extends StationComponent {
  // ...
}
```

## Customization

Edit `create-lobby-assets.lua` to customize:

- `LOBBY_ORIGIN` - Move the entire lobby to a different position
- `GROUND_Y` - Adjust floor height
- Colors, materials, and sizes of each element

## Visual Indicators

### Difficulty Orb Colors
The difficulty pedestal orb should change color based on level:
- Level 1: Green (50, 255, 100)
- Level 2: Yellow (255, 255, 50)
- Level 3: Orange (255, 150, 50)
- Level 4: Red (255, 80, 80)
- Level 5: Purple (200, 50, 255)

### Mode Banner Colors
- Standard: Blue (50, 100, 200)
- Ironman: Red (200, 50, 50)

### Portal States
- Not Ready: Purple with "SELECT MERCENARY" text
- Ready: Bright green glow, "ENTER DUNGEON" text


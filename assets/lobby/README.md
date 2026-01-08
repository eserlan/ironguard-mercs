# Lobby Assets

This folder contains the Roblox model definitions for the lobby ("Sanctuary of Valor").

## Structure

The `Lobby.model.json` file defines the complete lobby layout with all interactive stations:

| Model | Component Tag | Purpose |
|-------|---------------|---------|
| **MercenaryLocker** | `LobbyRosterAltar` | Select mercenary from roster |
| **DifficultyPedestal** | `LobbyBellsOfFate` | Set mission difficulty (1-5) |
| **ModeBanner** | `LobbyBlackBell` | Toggle Standard/Ironman mode |
| **DungeonPortal** | `LobbyTheGreatGate` | Enter mission when ready |
| **PartyPad** | `LobbyCircleOfUnity` | Form/join party |
| **AbilityTerminal** | `LobbyTomeOfWhispers` | Configure ability loadout |
| **GearBench** | `LobbyHealingFountain` | Manage gear/equipment |
| **LobbySpawn** | - | Player spawn point |

## Syncing

These assets are synced to Roblox Studio via Rojo:

```bash
# Start Rojo sync (watches for changes)
rojo serve

# In Studio, connect to localhost:34872
```

## Editing

- **In Code**: Edit `Lobby.model.json` and Rojo will sync changes to Studio
- **In Studio**: Make changes, then run the export script to update the JSON (see below)

## Export from Studio

If you make changes in Studio and want to update the JSON:

1. Run `resources/lobby/export-lobby.lua` in Studio command bar
2. Copy the output to `Lobby.model.json`

Or use the Rojo plugin's "Export to File" feature on the Lobby folder.

## Art Direction

See `/specs/ART_DIRECTION.md` for the visual theme:
- **Theme**: High Traditional Fantasy - "Sanctuary of Valor"
- **Materials**: Marble, stone, gold filigree
- **Lighting**: Warm ambers, god-rays, celestial glow


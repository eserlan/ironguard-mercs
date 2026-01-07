# Data Model: Vertical Slice

**Feature**: 001-core-gameplay

## Domain Entities

### 1. RunConfig
Inputs to start a run.
- `Seed`: number
- `Mode`: "ArenaClear"
- `MissionMode`: "Standard" | "Ironman"
- `Difficulty`: number

### 2. MatchState
Mutable runtime state.
- `Phase`: Lobby | Generating | Spawning | Playing | Ending | Results
- `Wave`: number (Current wave)
- `EnemiesAlive`: number

### 3. WorldPlan (Pure Logic)
Output of Procgen algorithm.
- `Layout`: List<TileDef> (Asset ID + Position + Rotation)
- `SpawnNodes`: List<Vector3> (Player starts)
- `EnemyNodes`: List<Vector3> (Enemy spawn points)

### 4. RunResult
Output of a finished run.
- `Success`: boolean
- `TimeElapsed`: number
- `Rewards`: Map<Currency, Amount>

## Relationships
- **RunService** manages **MatchState**.
- **ProcgenService** creates **WorldPlan** from **RunConfig**.
- **WorldSpawner** consumes **WorldPlan** to create physical instances.

## Persistent Entities

### 5. Mercenary (Persistent)
A unit owned by a player.
- `Id`: string
- `Name`: string
- `Class`: string
- `Level`: number
- `XP`: number
- `CurHealth`: number (for wounded state)
- `EquippedGear`: List<GearId>

### 6. Roster (Persistent)
Collection of mercenaries for a single player.
- `PlayerId`: string
- `Capacity`: number
- `Mercenaries`: List<Mercenary>
- `Currency`: Map<Currency, Amount> (Gold, etc.)
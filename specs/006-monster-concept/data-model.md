# Data Model: Monsters & Opponents

**Scope**: Enemy Definitions & AI State

## Core Entities

### 1. EnemyArchetype (Schema)
The data-driven template for an enemy.
- **Properties**:
  - `Id`: string
  - `Role`: Enum (Bruiser, Assassin, Artillery, etc.)
  - `Tier`: Enum (Minion, Elite, Champion, Boss)
  - `Stats`: { HP, Speed, Mitigation, ThreatBiasMultiplier }
  - `Moves`: List<MoveConfig>
  - `BreakThreshold`: number (Impact points needed to stagger)
  - `Visuals`: { SilhouetteId, VFXMotif, SoundSet }

### 2. MoveConfig
Specific definition of a telegraphed action.
- **Properties**:
  - `EffectBlocks`: List<EffectBlock> (From 003)
  - `Telegraph`: { Type: Circle|Cone|Line, Duration, WarningVisual }
  - `Interruptible`: boolean (Soft Cast)
  - `Breakable`: boolean (Hard Cast)
  - `Cooldown`: number

### 3. AIState (Runtime)
The current brain state of an instance.
- **Properties**:
  - `Phase`: Enum (Idle, Engage, Pressure, Recover, Reposition)
  - `CurrentTarget`: PlayerId
  - `TargetScores`: Map<PlayerId, number>
  - `RoleFloorsMet`: boolean
  - `LastInteractionTime`: number

### 4. BreakMeter (Component)
Tracks disruption progress.
- **Properties**:
  - `CurrentValue`: number
  - `DecayRate`: number (Points per second)
  - `IsStaggered`: boolean
  - `StaggerDurationRemaining`: number

## Relationships

- **EnemyService** creates **AIState** from **EnemyArchetype**.
- **TelegraphService** uses **MoveConfig** to sync visuals.
- **BreakMeter** logic consumes **CombatIntents** (Breaker tags) to trigger **Stagger**.

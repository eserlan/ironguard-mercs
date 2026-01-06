# Data Model: Abilities Framework

**Feature**: 003-abilities-framework

## Schema Definitions

### 1. AbilityConfig
Static definition of a skill.
- `Id`: string
- `Category`: Enum (Mobility, Offense, Defense)
- `Targeting`: Enum (Self, Point, Entity, Direction, Area)
- `Cooldown`: number
- `Range`: number
- `EffectBlocks`: List<EffectBlock>
- `Tags`: List<string> (e.g., "Interruptible")

### 2. EffectBlock (Polymorphic)
Reusable logic unit.
- `Damage`: { Amount, Type, Scaling }
- `Heal`: { Amount, Scaling }
- `Dash`: { Distance, Speed }
- `ApplyStatus`: { Id, Duration, Stacks }
- `SpawnProjectile`: { Id, Speed, OnHit: List<EffectBlock> }
- `AoE`: { Radius, Effects: List<EffectBlock> }

### 3. AbilityIntent (Network C->S)
Client request.
- `AbilityId`: string
- `Timestamp`: number
- `Seq`: number
- `Payload`: { TargetId? | Point? | Direction? }

### 4. AbilityEvent (Network S->C)
Server outcome.
- `Type`: Activated | Rejected | EffectApplied | ProjectileSpawned
- `AbilityId`: string
- `Data`: Dictionary (Context-specific)

## Relationships
- **AbilityService** loads **AbilityConfig**.
- **AbilityService** processes **AbilityIntent**.
- **EffectResolver** executes **EffectBlock**.
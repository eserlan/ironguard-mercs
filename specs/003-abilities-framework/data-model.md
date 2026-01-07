# Data Model: Abilities Framework

**Feature**: 003-abilities-framework

## Schema Definitions

### 1. AbilityConfig
Static definition of a skill.
- `Id`: string
- `Name`: string
- `Category`: Enum (Mobility, Offense, Defense, Utility)
- `ActivationType`: Enum (Instant, Targeted, Channel)
- `Targeting`: Enum (Self, Point, Entity, Direction, Area)
- `Range`: number
- `Variants`: { Top: AbilityVariantConfig, Bottom: AbilityVariantConfig }
- `Tags`: List<string>

### 2. AbilityVariantConfig
Parameters for a specific execution context.
- `Cooldown`: number
- `EffectBlocks`: List<EffectBlock>
- `Cost`: number (optional)

### 3. AbilityIntent (Network C->S)
Client request to execute an action.
- `SlotIndex`: number (assigned in loadout)
- `Action`: "Top" | "Bottom"
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
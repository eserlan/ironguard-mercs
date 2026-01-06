# Data Model: Player Classes

**Scope**: Classes & Loadouts

## Core Entities

### 1. ClassConfig
Defines the archetype identity.
- **Properties**:
  - `Id`: string
  - `Name`: string
  - `Role`: Enum (Protector, Striker)
  - `AbilityLibrary`: List<AbilityId>
  - `BaseStats`: Dictionary (HP, Speed, Defense)

### 2. AbilityVariantConfig (Extends 003)
Specific execution profile for a variant.
- **Properties**:
  - `Cooldown`: number
  - `EffectBlocks`: List<EffectBlock>
  - `Cost`: number (Optional)

### 3. AbilityDefinition
The container for TOP/BOTTOM actions.
- **Properties**:
  - `Id`: string
  - `Name`: string
  - `Variants`: { Top: AbilityVariantConfig, Bottom: AbilityVariantConfig }

### 4. LoadoutConfig
The player's active setup for a run.
- **Properties**:
  - `ClassId`: string
  - `Slots`: Map<number, AbilityId> (Index 1-4)

## Relationships

- **LoadoutConfig** belongs to a **Player** for a specific run.
- **LoadoutConfig** must reference **AbilityIds** that exist in the **ClassConfig**'s library.
- **AbilityService** resolves **AbilityDefinition** based on the player's current **LoadoutConfig** and the **ActionSlot** (Top/Bottom) in the intent.

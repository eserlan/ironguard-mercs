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
  - `EquippedSlots`: EquippedSlot[] (Array of slotIndex and abilityId)

## Class-Specific Effect Parameters

These definitions specify the `params` schema for `EffectBlock` objects used by specialized class abilities.

### 1. Scorch (Status)
- `statusEffectId`: "scorch"
- `damagePerTick`: number (Fire damage)
- `interval`: number (Seconds between ticks)
- `duration`: number (Total effect lifetime)

### 2. Untargetable (Status)
- `statusEffectId`: "untargetable"
- `duration`: number (Seconds before character is targetable again)

### 3. Tether (Logic)
- `statusEffectId`: "tether"
- `radius`: number (Max distance from origin before movement is blocked)
- `duration`: number (Lifetime of the tether)

### 4. Area of Effect (AoE)
Applied to `Damage` or `Status` blocks.
- `radius`: number (Studs from impact point)
- `falloff`: boolean (If true, effect strength decreases at edge)

## Relationships
...

# Data Model: Progression & Level Up

**Scope**: XP, Levels, and Rewards

## Core Entities

### 1. RunPerk (Schema)
A temporary upgrade available during a run.
- **Properties**:
  - `Id`: string
  - `Type`: Enum (Trait, Augment, StatNudge)
  - `Rarity`: Enum (Common, Rare, Legendary)
  - `Effect`: EffectBlock (From 003)
  - `Cap`: number (Max stacks or stat limit)

### 2. MetaUnlock (Schema)
A persistent account upgrade.
- **Properties**:
  - `Id`: string
  - `Type`: Enum (Class, Ability, Cosmetic)
  - `RequiredLevel`: number

### 3. RunState (Runtime)
Shared state for the active squad.
- **Properties**:
  - `TeamLevel`: number
  - `CurrentXP`: number
  - `Threshold`: number (XP needed for next level)
  - `ActivePerks`: Map<PlayerId, List<RunPerk>>

### 4. PlayerProfile (Persistent)
Stored in DataStore.
- **Properties**:
  - `MetaLevel`: number
  - `TotalXP`: number
  - `UnlockedAbilities`: List<AbilityId>
  - `UnlockedClasses`: List<ClassId>

## Relationships

- **ProgressionService** manages the **RunState**.
- **RunState** triggers **RunPerk** selection events.
- **PerkService** applies **EffectBlocks** to **Combatants**.
- **DataService** persists the **PlayerProfile**.

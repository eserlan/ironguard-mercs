# Data Model: Combat System

**Feature**: 002-combat-system

## Core Entities

### 1. Combatant
Runtime wrapper for any entity that can fight (Player/Enemy).
- `Id`: string
- `Team`: Enum (Player, Enemy)
- `Health`: { Current: number, Max: number }
- `Stats`: { Attack: number, Armor: number, Speed: number }
- `Statuses`: List<ActiveStatus>

### 2. WeaponConfig
Static definition of a weapon.
- `Id`: string
- `Type`: Enum (Melee, Hitscan)
- `Damage`: number
- `Cooldown`: number
- `Range`: number
- `VFX`: { FireId, ImpactId }

### 3. CombatIntent (Network)
Client request to attack.
- `WeaponId`: string
- `Origin`: Vector3
- `Direction`: Vector3
- `Timestamp`: number

### 4. DamageResult (Logic Output)
Outcome of a resolved attack.
- `Amount`: number
- `IsCrit`: boolean
- `TargetId`: string
- `IsFatal`: boolean

## Relationships
- **CombatService** maps **Combatant** to Roblox Instance.
- **WeaponService** loads **WeaponConfig**.
- **StatusService** modifies **Combatant.Stats**.

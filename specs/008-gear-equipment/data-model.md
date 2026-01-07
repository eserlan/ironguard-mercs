# Data Model: Gear & Equipment

**Scope**: Item Schemas & Cap Constants

## Core Entities

### 1. GearItem (Schema)
The static definition of a piece of equipment.
- **Properties**:
  - `Id`: string
  - `Name`: string
  - `Slot`: EquipmentSlot (Weapon, Offhand, Armour, Utility)
  - `Type`: GearType (Passive, Active, Reactive, Consumable)
  - `Rarity`: GearRarity (Common, Uncommon, Rare, Exotic)
  - `Triggers`: List<EventTrigger> (e.g., "on_block", "on_kill")
  - `Effects`: List<EffectBlock> (From 003)
  - `ClassFilter`: List<ClassId> (Empty = Universal)
  - `Cooldown`: number? (For Active/Reactive)
  - `MaxCharges`: number? (For Consumable)

### 2. PlayerEquipment (Runtime)
The currently equipped items for a player instance.
- **Properties**:
  - `UserId`: number
  - `Slots`: Map<EquipmentSlot, GearId>
  - `Sideboard`: List<GearId> (Items found but not equipped)

### 3. ActiveStatus (Extended)
Gear can apply statuses that interact with the **Progression Caps (007)**.

## Global Constants (Hard Caps)

| Stat | Cap Value | Description |
|------|-----------|-------------|
| `GEAR_CDR_MAX` | 0.40 | Cooldown reduction from gear cannot exceed 40%. |
| `GEAR_DMG_AMP_MAX` | 0.25 | Flat damage amplification from gear cannot exceed 25%. |
| `GEAR_CC_DURATION_MAX` | 0.30 | Crowd control duration increases capped at 30%. |

## Enums

```typescript
export enum EquipmentSlot {
    Weapon = "Weapon",
    Offhand = "Offhand",
    Armour = "Armour",
    Utility = "Utility"
}

export enum GearType {
    Passive = "Passive",
    Active = "Active",
    Reactive = "Reactive",
    Consumable = "Consumable"
}

export enum GearRarity {
    Common = "Common",
    Uncommon = "Uncommon",
    Rare = "Rare",
    Exotic = "Exotic"
}
```

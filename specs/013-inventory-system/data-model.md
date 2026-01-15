# Inventory Data Model

## Schema Definitions

### Item Identity

```typescript
// shared/domain/inventory/types.ts

export enum ItemCategory {
    Gear = "Gear",
    Consumable = "Consumable",
    Material = "Material"
}

export enum ItemRarity {
    Common = "Common",
    Uncommon = "Uncommon",
    Rare = "Rare",
    Epic = "Epic",
    Legendary = "Legendary"
}

export interface ItemDefinition {
    id: string; // "weapon_sword_iron"
    name: string;
    category: ItemCategory;
    rarity: ItemRarity;
    maxStack: number; // 1 for Gear
    // ... stats, description, icon
}

export interface InventoryItem {
    itemTypeId: string; // Refers to ItemDefinition.id
    instanceId?: string; // UUID for unique items (Gear)
    quantity: number;   // Current stack size
    metadata?: Record<string, unknown>; // For dynamic stats/durability (future)
}
```

### Player Persistence (Profile)

Stored in DataStore via `012-save-player-progression`.

```typescript
// server/services/PlayerProfileService.ts (Schema Extension)

export interface EquipmentLoadout {
    weapon?: InventoryItem;
    offhand?: InventoryItem;
    armour?: InventoryItem;
    trinket1?: InventoryItem;
    trinket2?: InventoryItem;
    quickSlots: (InventoryItem | undefined)[]; // Fixed size 4
}

export interface PlayerProfile {
    // ... existing fields (class, level, xp)
    
    inventory: {
        ownedItems: InventoryItem[]; // The "Stash"
        loadout: EquipmentLoadout;   // Currently equipped
        settings: {
            autoSort: boolean;
        }
    }
}
```

### Runtime State (Session)

Transient state during a run.

```typescript
// server/services/InventoryService.ts

interface SessionState {
    backpack: InventoryItem[]; // The "In-Run" bag.
    // loadout is read from Profile but "active" state might be tracked here if durability is added.
}
```

## Network Contracts

### Events (Server -> Client)

```typescript
interface InventoryEvents {
    /** Full sync of owned inventory (Lobby join) */
    syncOwnedInventory(items: InventoryItem[]): void;
    
    /** Full sync of loadout */
    syncLoadout(loadout: EquipmentLoadout): void;
    
    /** Update backpack content (In-Run) */
    syncBackpack(items: InventoryItem[]): void;
    
    /** Feedback for loot pickup */
    itemAdded(item: InventoryItem, source: "Loot" | "Reward"): void;
}
```

### Functions (Client -> Server)

```typescript
interface InventoryFunctions {
    /** Move item from Stash to Loadout (Lobby only) */
    equipItem(itemIndex: number, slot: EquipmentSlot): boolean;
    
    /** Move item from Loadout to Stash (Lobby only) */
    unequipItem(slot: EquipmentSlot): boolean;
    
    /** Assign consumable to Quick Slot */
    setQuickSlot(itemIndex: number, slotIndex: number): boolean;
    
    /** Drop item from Backpack (In-Run) */
    dropBackpackItem(index: number): boolean;
}
```
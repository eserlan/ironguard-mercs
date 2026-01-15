# Quickstart: Using the Inventory System

## For Gameplay Developers

### Adding Loot (In-Run)
Use `InventoryService` to add items to the **Backpack**. This is transient state.

```typescript
import { Dependency } from "@flamework/core";
import { InventoryService } from "server/services/InventoryService";

const inventoryService = Dependency<InventoryService>();

// Example: Player picks up a potion
// Returns true if added (even partially), false if full
inventoryService.addToBackpack(player, "consumable_health_potion", 1);
```

### Checking Loadout (Combat)
To see what a player has equipped (e.g., for damage calculation), access the **Loadout**.

```typescript
const loadout = inventoryService.getLoadout(player);
if (loadout.weapon) {
    const weaponDef = ItemDB.get(loadout.weapon.itemTypeId);
    print(`Attacking with ${weaponDef.name}`);
}
```

### Extraction (End of Run)
When a run completes successfully, trigger the commit.

```typescript
// Moves backpack -> owned inventory
inventoryService.commitBackpackToStash(player);
```

## For UI Developers

### Accessing State
The `InventoryController` exposes the persistent Stash and the transient Backpack.

```tsx
import { useInventory } from "client/hooks/useInventory";

export function InventoryScreen() {
    const { stash, backpack, loadout } = useInventory();

    return (
        <frame>
            <InventoryGrid items={stash} title="Stash" />
            <LoadoutPanel items={loadout} />
        </frame>
    );
}
```

### Managing Items
Use controller functions to request moves.

```typescript
import { InventoryController } from "client/controllers/InventoryController";

// Equip a sword from Stash to Weapon Slot
InventoryController.equipItem(stashItemIndex, "Weapon");

// Drop item from Backpack (In-Run)
InventoryController.dropBackpackItem(backpackIndex);
```
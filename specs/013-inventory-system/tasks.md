# Tasks: Inventory System (MVP)

## Phase 1: Data & Domain
- [x] **Define Types**: `InventoryItem`, `ItemDefinition`, `EquipmentSlot`. <!-- id: 0 -->
- [x] **Item Database**: Create `shared/data/ItemDB.ts` with initial items (Weapon, Potion, Mat). <!-- id: 1 -->
- [x] **Stacking Logic**: Implement `shared/algorithms/inventory/stacking.ts` (add, merge, split). <!-- id: 2 -->
    - [x] Test: Add to empty.
    - [x] Test: Stack to max.
    - [x] Test: Overflow to new stack.
- [x] **Validation Logic**: Implement `shared/algorithms/inventory/validation.ts` (canEquip). <!-- id: 3 -->

## Phase 2: Persistence & Service
- [ ] **Profile Extension**: Update `PlayerProfile` interface to include `inventory` and `loadout`. <!-- id: 4 -->
- [ ] **InventoryService (Core)**:
    - [ ] `getLoadout(player)` / `getStash(player)`. <!-- id: 5 -->
    - [ ] `equipItem(player, itemId, slot)`. <!-- id: 6 -->
    - [ ] `unequipItem(player, slot)`. <!-- id: 7 -->
- [ ] **InventoryService (Session)**:
    - [ ] `addToBackpack(player, itemType, quantity)`. <!-- id: 8 -->
    - [ ] `dropFromBackpack(player, index)`. <!-- id: 9 -->
- [ ] **Extraction Logic**: Implement `commitBackpackToStash(player)` handling merging. <!-- id: 10 -->

## Phase 3: Runtime & Loot
- [ ] **Loot Object**: Create `server/components/LootComponent` for world items. <!-- id: 11 -->
- [ ] **Pickup Interaction**: Handle proximity/click -> `InventoryService.addToBackpack`. <!-- id: 12 -->
- [ ] **Death Hook**: Implement logic to clear backpack (keeping mats) on run failure. <!-- id: 13 -->

## Phase 4: UI
- [ ] **Inventory Controller**: Client-side state replication. <!-- id: 14 -->
- [ ] **Components**:
    - [ ] `InventoryGrid`: Generic grid for Stash/Backpack. <!-- id: 15 -->
    - [ ] `SlotComponent`: Renders icon + stack count. <!-- id: 16 -->
    - [ ] `TabControl`: Switch between Gear/Consumable/Material. <!-- id: 17 -->
- [ ] **Screens**:
    - [ ] `LobbyScreen`: Show Stash + Loadout. <!-- id: 18 -->
    - [ ] `IngameScreen`: Show Backpack (Overlay). <!-- id: 19 -->
# Implementation Plan: Inventory System (MVP)

**Branch**: `013-inventory-system` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Extraction-based Roguelite Inventory.

## Summary

This plan implements a persistent inventory system split into "Owned Inventory" (Stash) and "In-Run Backpack". It handles the full lifecycle: Loot Pickup -> Backpack -> Extraction -> Stash -> Loadout.

## Technical Context

**Language**: TypeScript (roblox-ts)
**Framework**: Flamework
**Persistence**: ProfileService (integrated via `012-save-player-progression`).
**State Management**: Server-authoritative with client prediction/replication.

## Architecture

### Modules
1.  **ItemDB (Shared)**: Static definitions of all items (Type, Rarity, MaxStack).
2.  **InventoryService (Server)**:
    - Manages `PlayerProfile.inventory`.
    - Manages `SessionState.backpack`.
    - Handles `Pickup`, `Equip`, `Extraction`.
3.  **InventoryController (Client)**:
    - Listens for replication.
    - Manages UI state (Tabs, Drag/Drop).

### Key Workflows
1.  **Loot Generation**: `LootService` spawns a physical part.
2.  **Pickup**: Player proximity/interaction -> `InventoryService.addToBackpack(player, itemType)`.
3.  **Extraction**: End of Dungeon Trigger -> `InventoryService.commitBackpackToStash(player)`.

## Phases

### Phase 1: Data & Domain (Brain)
- Define `InventoryItem`, `ItemDefinition` types.
- Create `ItemDatabase` with mock items (Sword, Potion, Iron).
- Implement `InventoryLogic`: Pure functions for stacking, splitting, and validating slots.
- **Test**: Unit tests for stacking logic (overflows, merging).

### Phase 2: Persistence & Service (Body)
- Extend `PlayerProfile` schema in `012` context.
- Implement `InventoryService`:
    - `loadProfile`: specific to inventory.
    - `equip/unequip`: mutating the profile loadout.
    - `addToBackpack`: handling session state.
    - `commitBackpack`: merging backpack into owned inventory.
- **Test**: Integration tests for "Save/Load" and "Extraction".

### Phase 3: Runtime Integration (Hands)
- Connect `LootService` (from 008/011) to `InventoryService`.
- Implement `LootObject` class (physical world item).
- Implement Death/Success hooks for Extraction logic.

### Phase 4: UI Implementation (Face)
- **Lobby UI**: "Stash" and "Loadout" panels.
- **HUD UI**: "Backpack" mini-view (or toggle).
- **Tabs**: Gear, Consumables, Materials.
- **Tooltips**: Stat comparisons.

## Complexity Tracking

| Complexity | Justification | Mitigation |
|------------|---------------|------------|
| Two Inventories | "Extraction" loop requires separating "At Risk" loot vs "Safe" loot. | Clear naming: `Backpack` (Risk) vs `Stash` (Safe). |
| Stacking Logic | UX requirement. | Use pure functions in `InventoryUtil` and unit test heavily. |
| Persistence | Core RPG requirement. | Leverage `012` ProfileService structure. |
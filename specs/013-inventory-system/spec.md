# Inventory System (MVP)

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-15
**Feature Branch**: `013-inventory-system`
**Input**: [User Requirements](/speckit.specify) - Extraction-style Roguelite Inventory.

## Summary

A lightweight inventory system that persists a player’s gear, consumables, and crafting materials across sessions. It supports equipping a "Run Loadout" from a persistent stash ("Owned Inventory") and managing a temporary "In-Run Backpack" for loot collected during a dungeon run. The system handles extraction (committing loot to stash) and death penalties.

## Goals

- **Persistence**: Persist player-owned items across sessions.
- **Loadout**: Allow equipping a limited "Run Loadout" from owned items.
- **Looting**: Support quick loot pickup in-run (auto-stacking where possible).
- **Usability**: Keep the UI simple, fast, and controller-friendly.
- **Integrity**: Prevent duplication and maintain server authority.

## Core Concepts

1.  **Owned Inventory (Stash)**: The permanent collection of all items the player has earned. Accessible only in the Lobby/Hub.
2.  **Run Loadout**: A specific subset of gear and consumables equipped for the next run. This is "active" during the run.
3.  **In-Run Backpack**: A temporary container for items picked up *during* a run.
4.  **Extraction**: The process of successfully completing a run, moving items from the *Backpack* to the *Owned Inventory*.
5.  **Stacks & Uniques**:
    - **Stackable**: Materials and Consumables stack up to a limit (e.g., 10 potions, 999 iron).
    - **Unique**: Gear (Weapons, Armour) is non-stackable and has unique Instance IDs to support future modifiers/rolls.

## Item Categories & Slots

### Categories
1.  **Gear**: Equippable items (Weapons, Armour, Trinkets). Unique.
2.  **Consumables**: Usable items (Potions, Bombs, Food). Stackable.
3.  **Materials**: Crafting reagents, currencies, tokens. Stackable. Not equippable.

### Slot Model
**Equipment Slots (Persistent Loadout)**:
- **Weapon**: 1 Slot
- **Offhand**: 1 Slot
- **Armour**: 1 Slot
- **Trinkets**: 2 Slots (A/B)

**Quick Slots (Consumables)**:
- **QuickSlot 1-4**: 4 Slots (Holds a stack reference)

**Backpack (In-Run)**:
- **Capacity**: Unlimited logical slots for MVP (constrained by stack sizes), or fixed slot count (e.g. 20) to force choices. *Decision: Fixed 24 slots for MVP to prevent hoarding.*

## Loot Flow

1.  **Pickup**: Player interacts with loot. Item is added to *In-Run Backpack*.
    - If stackable and type exists: Increment stack.
    - If unique or new type: Add to new slot.
    - If full: "Inventory Full" feedback.
2.  **Extraction (Success)**:
    - Run completes successfully.
    - All *Backpack* items are transferred to *Owned Inventory*.
    - *Backpack* is cleared.
3.  **Death (Failure)**:
    - Run fails.
    - **Rule**: Keep Materials only. Gear/Consumables found in-run are lost. (Configurable).
4.  **Direct Rewards**:
    - Quest rewards go directly to *Owned Inventory*, bypassing Backpack.

## User Scenarios & Testing

### User Story 1 - Lobby Management (Priority: P1)
**Description**: In the Lobby, I open my inventory. I see my "Stash" and my "Loadout". I move a "Steel Sword" from Stash to my Weapon Slot.
**Value**: Preparation loop.
**Independent Test**: Open Lobby UI. Equip item. Rejoin game. Verify item remains equipped.

### User Story 2 - In-Run Looting (Priority: P1)
**Description**: During a run, I pick up 3 "Health Potions". They stack into one slot in my Backpack. I also pick up a "Rare Shield" which takes a separate slot.
**Value**: Core gameplay loop.
**Independent Test**: Spawn items. Pickup. Check Backpack UI for correct stacking.

### User Story 3 - Extraction (Priority: P2)
**Description**: I finish the dungeon. On returning to the lobby, the "Rare Shield" I found is now in my "Owned Inventory" and can be equipped.
**Value**: Progression feedback.
**Independent Test**: Simulate run completion. Verify `InventoryService.commitBackpack` moves items correctly.

## Requirements

### Functional
- **FR-001**: System MUST persist *Owned Inventory* and *Loadout* via DataStore.
- **FR-002**: System MUST separate *Backpack* (transient) from *Owned Inventory* (persistent).
- **FR-003**: System MUST support stacking for Consumables and Materials.
- **FR-004**: System MUST enforce slot types (e.g., cannot equip Armour in Weapon slot).
- **FR-005**: Server MUST validate all equip/move actions (Authority).
- **FR-006**: Extraction logic MUST handle merging backpack stacks into owned inventory stacks.
- **FR-007**: Death logic MUST filter items based on retention rules (e.g., keep materials).

### UI/UX
- **Tabs**: Gear, Consumables, Materials, Loadout.
- **Interactions**: Click-to-equip, Tooltips.
- **Feedback**: "Loot Acquired" toast, "Inventory Full" warning.

## Technical Constraints
- **Data Integrity**: Critical. Use transactional logic for moving items between containers.
- **Replication**: Owned Inventory replicated only to owner.

## Open Questions
- **Q1**: Do we limit "Owned Inventory" size?
    - *A1*: Yes, default 100 slots for MVP. Expandable later.
- **Q2**: Can you change loadout mid-run?
    - *A2*: No. Loadout is locked at run start (unless "Safe Room" feature overrides this later). MVP = Locked.

## Success Criteria
- **SC-001**: Player can loot items, extract, and see them in Stash.
- **SC-002**: Rejoining the game restores the exact Loadout and Stash state.
- **SC-003**: Stacking logic works correctly (no infinite stacks, new stacks created on overflow).
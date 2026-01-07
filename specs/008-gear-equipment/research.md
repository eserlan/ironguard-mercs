# Research & Decisions: Gear & Equipment

**Date**: 2026-01-07
**Feature**: Gear & Equipment (008)

## Technical Decisions

### 1. Event-Driven Trigger System
**Decision**: Use `typescript-rx` streams from `CombatService` and `AbilityService` to drive gear triggers.
**Rationale**: 
- **Decoupling**: Gear logic doesn't need to be hardcoded into the attack logic.
- **Extensibility**: Adding a new trigger (e.g., "On Dodge") only requires subscribing to the relevant stream in the `GearEffectService`.

### 2. Slot-Based Cooldowns
**Decision**: Active gear shares the same cooldown infrastructure as abilities (from 003).
**Rationale**: 
- **Consistency**: Unified UI and server logic for all "buttons" the player presses.
- **UX**: Players can easily see active gear readiness on their ability bar.

### 3. Safe Room Only Swapping
**Decision**: Rigid enforcement of the "Safe Room" requirement for equipment changes.
**Rationale**: 
- **Pacing**: Prevents players from pausing to optimize gear for every single encounter.
- **UI Safety**: Eliminates the need for a complex, safe-to-use-in-combat inventory UI.

## UX Flow: Gear Acquisition & Equipping

1.  **Loot Cache**: Room clear triggers a chest spawn.
2.  **Pickup**: Interacting with the chest grants the item directly to the player's "Sideboard" (stash).
3.  **Safe Room**: Once in a Safe Room, the player opens the `GearPanel`.
4.  **Comparison**: Hovering over a sideboard item shows a side-by-side comparison with the currently equipped item in that slot.
5.  **Equip**: Clicking "Equip" performs a server-side validation check (class compatibility, slot availability) and updates the `PlayerEquipment` state.

## Open Questions Resolved
- **Q1: Drop Mechanics**: Chests at room clears + Elite/Boss drops.
- **Q2: Meta Integration**: Mile-stone unlocks add new items to the global pool.
- **Q3: Set Bonuses**: Deferred to v2.
- **Q4: Trading**: Personal loot only (no trading).

# Quickstart: Player Classes

**Feature**: 005-player-classes

## Setup

1.  **Ability Definitions**:
    -   Locate `src/shared/data/abilities/`.
    -   Ensure abilities now define `variants: { top, bottom }`.
2.  **Class Definitions**:
    -   Locate `src/shared/domain/classes/`.
    -   Configure `ShieldSaint` and `Ashblade` with their libraries.

## Validation Steps

1.  **Run Tests**:
    ```bash
    npm test src/shared/algorithms/classes/
    ```
    *Verifies shared cooldown logic and loadout validation.*

2.  **In Studio**:
    -   Select a class in the Lobby UI.
    -   Equip 4 abilities.
    -   Press `1` to trigger BOTTOM action.
    -   Press `Shift + 1` to trigger TOP action.
    -   **Expected**: Slot enters shared cooldown; TOP duration > BOTTOM duration.

## Metadata Nodes

-   **ShieldSaint VFX**: Ensure models have `ShieldNode` for impact effects.
-   **Ashblade VFX**: Ensure models have `MomentumNode` for trail effects.

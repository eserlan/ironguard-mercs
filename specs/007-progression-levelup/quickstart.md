# Quickstart: Progression & Level Up

**Feature**: 007-progression-levelup

## Authoring a New Perk

1.  **Define Effect**:
    -   Perks are built from `EffectBlocks` (from 003).
    -   Add entry in `src/shared/domain/progression/perks.ts`.
2.  **Set Caps**:
    -   Every stat nudge MUST have a `HardCap` (e.g., max 40% CDR).
3.  **Rarity**:
    -   Common: Standard stat nudges.
    -   Rare: Ability augments.
    -   Legendary: Game-changing Traits.

## Validation Steps

1.  **XP Math (Unit Test)**:
    ```bash
    npm test src/shared/algorithms/progression/xp-math.spec.ts
    ```
    *Verifies that the XP threshold increases correctly per level.*

2.  **Deterministic Perks (Unit Test)**:
    ```bash
    npm test src/shared/algorithms/progression/perk-resolver.spec.ts
    ```
    *Verifies that the same seed/level always produces the same choices.*

3.  **In Studio**:
    -   Grant team XP using the `AdminService`.
    -   Verify that ALL players see the choice UI simultaneously.
    -   Test the `Shift` modifier interaction if applicable.

## Balancing Knobs

-   **Base Threshold**: 1000 XP (Level 1 -> 2).
-   **Scale Factor**: 1.2x (XP needed per level).
-   **Micro Slow Intensity**: 0.75 (75% time slow).

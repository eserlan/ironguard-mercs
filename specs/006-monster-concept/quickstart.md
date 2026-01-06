# Quickstart: Monsters & Opponents

**Feature**: 006-monster-concept

## Authoring a New Enemy

1.  **Define Schema**:
    -   Add a entry in `src/shared/data/enemies/archetypes.ts`.
    -   Specify `Role` and `Tier` first; this drives targeting weighting.
2.  **Configure Moves**:
    -   Define at least one "Signature Move" with a >1.5s wind-up.
    -   Mark `Breakable: true` if it's a Champion or Boss move.
3.  **VFX Standard**:
    -   Ensure the model has a clear `TelegraphPart` at the base for ground markers.

## Validation Steps

1.  **AI Logic (Unit Test)**:
    ```bash
    npm test src/shared/algorithms/enemies/target-scoring.spec.ts
    ```
    *Verifies that the Assassin correctly prioritizes isolated targets despite low Threat Bias.*

2.  **Break Logic (Unit Test)**:
    ```bash
    npm test src/shared/algorithms/enemies/break-logic.spec.ts
    ```
    *Verifies that the Break Meter decays correctly and triggers Stagger at the threshold.*

3.  **In Studio**:
    -   Spawn the enemy archetype using the `AdminService`.
    -   Observe the `TelegraphStarted` event rendering the correct ground shape.
    -   Verify that the enemy enters the `Recover` state after the move.

## AI Debugging

-   Toggle the `AIDebug` overlay in the `DebugController` to see real-time `TargetScore` calculations above enemy heads.

# Quickstart: Gear & Equipment Authoring

**Feature**: 008-gear-equipment

## Authoring a New Item

1.  **Define YAML/TS**:
    -   Add entry in `src/shared/data/gear/registry.ts`.
2.  **Assign Slot & Type**:
    -   Ensure the type (Passive/Active/Reactive) matches the intended fantasy.
3.  **Effect Blocks**:
    -   Reuse `EffectBlocks` from 003.
    -   *Example*: A reactive shield uses the `Shield` block with a `on_damage_taken` trigger.

## Template

```yaml
id: "iron-buckler"
name: "Iron Buckler"
slot: Offhand
type: Reactive
trigger: "on_block"
effect: { type: "Shield", params: { amount: 50, duration: 2 } }
cooldown: 5s
rarity: Common
class_filter: ["shield-saint"]
```

## Validation Steps

1.  **Pure Logic Test**:
    ```bash
    npm test src/shared/algorithms/gear/trigger-eval.spec.ts
    ```
    *Verifies the reactive trigger fires on the correct event.*

2.  **Hard Cap Test**:
    ```bash
    npm test src/shared/algorithms/gear/gear-caps.spec.ts
    ```
    *Verifies that stacking multiple CDR items is correctly capped at 40%.*

3.  **In Studio**:
    -   Spawn a `LootCache` in a test room.
    -   Confirm pickup moves the item to the Sideboard.
    -   Enter Safe Room and equip.

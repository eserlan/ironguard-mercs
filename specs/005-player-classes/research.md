# Research & Decisions: Player Classes

**Feature**: Player Classes (005)

## Architecture Decisions

### 1. TOP/BOTTOM Unified Ability Model
**Decision**: Each equipped ability is a single logical unit with two variant configs.
**Rationale**:
- **Simplicity**: One slot = One ability. Easier for players to grok than "Slot 1A and Slot 1B".
- **Cohesion**: The TOP and BOTTOM actions are thematically linked (e.g. Shield Slam vs. Shield Block).
- **Balance**: Shared cooldown ensures players don't just spam both halves.

### 2. Targeting Bias (Soft Taunt)
**Decision**: Use a "Threat Pulse" system rather than hard aggro tables.
**Rationale**:
- **Action Gameplay**: Hard locks feel bad when movement is fluid.
- **Role Fantasy**: Shield Saint should feel like they are *attracting* attention, not mind-controlling mobs.
- **Implementation**: `CombatService` emits bias signals; AI pathfinding prefers targets with high bias.

### 3. Shift Modifier Input
**Decision**: `Shift` + `SlotKey` for TOP actions.
**Rationale**:
- **Standard ARPG controls**: Familiar to players.
- **Intentionality**: TOP actions are powerful and have long cooldowns; requiring a modifier prevents accidental use.

## Open Questions Resolved
- **Loadout Size**: 4 active slots (as per spec).
- **Control Scheme**: Modifier-based (Shift).

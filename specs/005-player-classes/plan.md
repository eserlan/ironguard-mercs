# Implementation Plan: Player Classes System

**Branch**: `005-player-classes` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Player Classes system definition (TOP/BOTTOM abilities).

## Summary

This plan implements the Player Classes system, establishing the primary gameplay identity for players. It introduces class-specific ability libraries and a limited loadout system. Abilities follow a TOP/BOTTOM action model where two execution variants share a single cooldown slot. The system integrates with the existing Abilities Framework (003) and Combat System (002).

## Technical Context

**Language/Version**: TypeScript (roblox-ts)
**Architecture**: Flamework (DI, Services, Controllers)
**Testing**: Vitest (pure logic), TestEZ (Roblox integration)
**Target Platform**: Roblox Client/Server
**Constraints**: 
- Server-authoritative validation for loadouts and casts.
- Shared cooldown bucket per slot.
- Optimistic UI with server-driven impact feedback.
**Scale/Scope**: v1 supports Shield Saint and Ashblade with 4 loadout slots.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Modular Architecture**: Shared domain logic for class configs; services for authoritative state.
- [x] **Test-Driven Quality**: Pure logic for loadout validation and shared cooldown math will be Vitest-tested.
- [x] **Documentation First**: This plan and associated specs are defined before code.
- [x] **Iterative Delivery**: Starting with 2 distinct classes to validate the system.

## Project Structure

### Documentation

```text
specs/005-player-classes/
├── plan.md              # This file
├── research.md          # Architecture decisions
├── data-model.md        # Core entities (Class, Loadout)
├── quickstart.md        # Setup & dev workflow
└── contracts/           # Net.ts extensions
```

### Source Code

```text
src/
├── shared/
│   ├── domain/
│   │   └── classes/        # ClassConfig, AbilityVariant types
│   ├── algorithms/
│   │   └── classes/        # Loadout & Cooldown logic (TESTED)
│   └── net.ts              # GlobalEvents (SelectClass, SetLoadout)
├── server/
│   ├── services/
│   │   ├── ClassService.ts     # Validates class availability
│   │   ├── LoadoutService.ts   # Manages per-run player loadouts
│   │   └── TargetingBias.ts    # Soft-taunt mechanics
├── client/
│   ├── controllers/
│   │   ├── ClassController.ts  # Choice UI bridge
│   │   └── AbilityBarController.ts # 4-slot HUD with modifiers
```

## Phases

### Phase 0: Foundation & Schema
- Define `ClassConfig` and `LoadoutConfig` interfaces in `src/shared/domain/classes`.
- Extend `AbilityDefinition` from 003 to support `topAction` and `bottomAction` variants.

### Phase 1: Pure Logic (Brain)
- Implement `LoadoutValidator` (pure function).
- Implement `SlotCooldownManager` (handles shared buckets).
- **Test**: Vitest coverage for variant cooldown selection.

### Phase 2: Server Services (Body)
- Implement `ClassService` and `LoadoutService`.
- Update `AbilityService` (from 003) to consume `slotIndex` and `actionVariant`.
- Implement `EnemyTargetingBiasService` for soft-taunt effects.

### Phase 3: Client Experience
- Implement `AbilityBarController` (HUD).
- Implement `Shift` modifier logic for TOP action selection.
- Clear VFX signaling for TOP action activations.

### Phase 4: Shield Saint Implementation (Spiritual Armor)
**Goal**: Finalize the server resolution logic for the Saint's unique defensive keywords.
-   **Mitigation**: Standardize damage reduction percentage logic.
-   **Shields**: Implement temp-HP buffers.
-   **Redirect**: Handle damage forwarding from allies to the Saint.
-   **VFX**: Implement holy thematic visuals (Pillars of Light, Gold Ribbons).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Shared Cooldowns | Tactical Depth | Individual cooldowns would remove the risk/reward of using a TOP action. |
| Soft Taunt | Heroic Feel | Hard aggro locks feel artificial in action combat. |
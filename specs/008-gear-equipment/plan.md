# Implementation Plan: Gear & Equipment System

**Branch**: `008-gear-equipment` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Bounded gear system providing tactical utility and build expression.

## Summary

This plan defines the implementation of the Gear & Equipment system—a set of equippable items that enhance characters through conditional effects, utility actions, and light stat nudges. The system complements class abilities and uses an event-driven trigger model.

## Technical Context

**Language/Version**: TypeScript (roblox-ts)
**Architecture**: Flamework (DI, Services, Components)
**Primary Dependencies**: Combat (002) for trigger hooks, Abilities (003) for cooldown integration, Progression (007) for meta unlocks.
**Testing**: Vitest (Unit/Integration)
**Target Platform**: Roblox Client/Server.
**Performance Goals**: Gear effect application < 1 frame (16ms).
**Constraints**: 
- Server-authoritative equipment state.
- Gear swaps restricted to Safe Rooms only.
- Global caps on stacking modifiers (CDR max 40%).
- Max 1 Exotic item equipped at a time.

## Constitution Check

- [x] **Modular Architecture**: Logic isolated in `shared/algorithms/gear`.
- [x] **Test-Driven Quality**: Caps and triggers verified via Vitest.
- [x] **Documentation First**: All supporting artifacts (`data-model`, `research`, `tuning`) are present.

## Project Structure

### Documentation

```text
specs/008-gear-equipment/
├── plan.md              # This file
├── research.md          # Technical decisions and UX flow
├── data-model.md        # Schemas and cap constants
├── tuning.md            # Drop rates and rarity weights
├── quickstart.md        # Authoring guide
└── contracts/           # Net.ts extensions
```

### Source Code

```text
src/
├── shared/
│   ├── domain/gear/        # Types: GearItem, GearRarity
│   ├── algorithms/gear/    # Pure Logic: Caps, Trigger Eval
│   └── net.ts              # Network Contracts
├── server/
│   ├── services/           # GearService, LootService
│   └── components/         # PlayerGearComponent
├── client/
│   ├── controllers/        # GearController, VFX
│   └── ui/                 # GearPanel, Tooltips
```

## Phases

### Phase 1: Pure Logic (Brain)
- Implement `gear-caps.ts` and `trigger-eval.ts`.
- **Test**: Vitest coverage for modifier stacking and trigger accuracy.

### Phase 2: Server Services (Body)
- Implement `GearService` (Authority).
- Implement `LootService` (Chest spawning + Drop tables).
- Wire into `CombatService` (002) events.

### Phase 3: Client Experience
- Implement `GearPanel` (Safe Room Inventory).
- Implement `VFXController` for proc feedback.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Safe Room Only | Co-op Pacing | Mid-run swapping creates massive UI/UX friction. |
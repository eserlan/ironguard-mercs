# Implementation Plan: Progression & Level Up System

**Branch**: `007-progression-levelup` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Hybrid progression model (Run=Power, Meta=Options) with shared Team Power Level.

## Summary

This plan defines the implementation of the Progression & Level Up system. It establishes a dual-track architecture: a session-based **Run Level** (shared by the squad) and a persistent **Meta Level** (individual account growth). The system manages authoritative XP accumulation, simultaneous level-up events, and individual reward selection using tiered co-op pacing (Safe Rooms and Micro Slow).

## Technical Context

**Language/Version**: TypeScript (roblox-ts)
**Architecture**: Flamework (DI, Services, Components)
**State Management**: `typescript-rx` for XP streams and level-up notifications.
**Testing**: Vitest (pure XP math and threshold logic), TestEZ (UI integration).
**Target Platform**: Roblox Client/Server.
**Performance Goals**: Level-up event replication < 100ms; persistent saving < 500ms.
**Constraints**: 
- Server-authoritative XP and Level state.
- Deterministic reward generation per seed.
- Hard caps on all stat-modifying perks.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Modular Architecture**: Progression logic isolated in `src/shared/algorithms/progression`.
- [x] **Test-Driven Quality**: XP curves and catch-up math will be unit-tested in Node.js.
- [x] **Documentation First**: This plan and spec precede implementation.
- [x] **Iterative Delivery**: Starting with core XP loop and basic Run Perks.

## Project Structure

### Documentation

```text
specs/007-progression-levelup/
├── plan.md              # This file
├── research.md          # XP scaling and slow-mo research
├── data-model.md        # XP schemas and perk definitions
├── quickstart.md        # Tuning guide
└── contracts/           # Level-up and perk selection remotes
```

### Source Code

```text
src/
├── shared/
│   ├── domain/
│   │   └── progression/    # RunPerk, MetaUnlock, RewardBucket schemas
│   ├── algorithms/
│   │   └── progression/    # Pure Logic (TESTED):
│   │       ├── xp-math.ts      # XP curves and Team Level logic
│   │       ├── perk-resolver.ts # Random choice generation from seed
│   │       └── caps.ts         # Hard cap enforcement logic
│   └── net.ts              # Level-up events and choice intents
├── server/
│   ├── services/
│   │   ├── ProgressionService.ts # Orchestrates XP and Level state
│   │   ├── PerkService.ts        # Manages active perks and application
│   │   └── TimeService.ts        # Handles squad-wide Micro Slow
│   └── components/
│       └── ProgressionCmpt.ts    # Client-facing XP state mirror
├── client/
│   ├── controllers/
│   │   ├── ProgressionController.ts # Choice UI and slow-mo feedback
│   │   └── RewardController.ts      # Applies local visuals for level-up
│   └── ui/
│       └── LevelUpMenu.tsx          # Selection screen with timer
```

## Phases (Derived from Input)

### Phase 1: Progression Philosophy & Foundation
- Define `RunLevel` and `MetaLevel` thresholds and max caps.
- Implement `HardCap` registry for all stat nudges.

### Phase 2: XP Model & Sharing
- Implement `XPStream` using `typescript-rx`.
- Build the **Team Power Level** shared XP bar logic.
- Implement individual Meta-XP accumulation on run end.

### Phase 3: Level-Up Rewards (Buckets)
- Implement `PerkRegistry` (Traits, Augments, Stats).
- Build the `PerkResolver` to generate 3 choices deterministically from seed.

### Phase 4: Level-Up Choice UX (Pacing)
- Implement **Micro Slow** (70–80%) logic in `TimeService`.
- Build the `LevelUpMenu` with 8-10s timer and **Auto-Pick** fallback.
- Implement **Safe Room** full-pause logic.

### Phase 5: Data Schema & Persistence
- Define `PlayerProfile` versioned schema for Meta Progression.
- Integrate with `DataService` (001) for persistent account unlocks.

### Phase 6: Balance & Tuning
- Implement `CatchUpService` for late-joiners.
- Add telemetry for perk pick rates and win correlations.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Team Power Level | Co-op Fairness | Individual levels create massive power gaps and resentment in 4p squads. |
| Micro Slow | Action Pacing | Full pause interrupts combat flow; no slow makes choosing perks lethal. |
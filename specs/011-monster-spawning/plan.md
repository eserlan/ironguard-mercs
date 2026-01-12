# Implementation Plan: Monster Spawning & Encounter Design

**Branch**: `011-monster-spawning` | **Date**: 2026-01-11 | **Spec**: [specs/011-monster-spawning/spec.md](./spec.md)
**Input**: Feature specification from `specs/011-monster-spawning/spec.md`

## Summary

We will implement a **SpawnDirector** service that deterministically populates generated dungeons with **Monster Packs**. The system bridges the gap between Dungeon Generation (004) and Monster Entities (006). It includes a custom **ModelPool** for performance, uses **Roblox Attributes** for map metadata, and implements a **Client-Side Visualizer** for "Ambush" events to maintain server performance.

## Technical Context

**Language/Version**: Luau (Roblox)
**Primary Dependencies**: Flamework (Service/Controller), @rbxts/services, @rbxts/react (for UI hooks if needed)
**Storage**: N/A (Runtime state only)
**Testing**: TestEZ
**Target Platform**: Roblox Server & Client
**Project Type**: Single (Shared/Server/Client)
**Performance Goals**: >55fps heartbeat during room activation
**Constraints**: StreamingEnabled compatibility; Top/Bottom Ability separation
**Scale/Scope**: ~10 active encounters per map; 100+ enemies total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Modular Architecture**: Uses Flamework Services (`SpawnDirector`, `EnemySpawnService`) and shared logic.
- [x] **Pure Game Logic**: Pack selection and wave math (`wave-plan.ts`) in `src/shared`.
- [x] **Test-Driven**: Unit tests defined for `SpawnDirector`.
- [x] **Top/Bottom Design**: Spawning state (Top) separates from Ambush VFX (Bottom/Client).
- [x] **Enemy AI**: Integration with `TargetingBiasService` (006) planned.
- [x] **UI Safety**: N/A (No UI in this feature).

## Project Structure

### Documentation (this feature)

```text
specs/011-monster-spawning/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── shared/
│   ├── config/
│   │   └── MonsterPacks.ts       # Pack definitions
│   ├── types/
│   │   └── SpawningTypes.ts      # Shared interfaces
│   ├── utils/
│   │   └── ModelPool.ts          # Custom pooling logic
│   └── algorithms/
│       └── wave-plan.ts          # Pure function for wave composition
├── server/
│   ├── services/
│   │   ├── SpawnDirector.ts      # Main orchestration logic
│   │   └── EnemySpawnService.ts  # Handles entity instantiation
│   ├── components/
│   │   ├── EncounterZone.ts      # Runtime room logic
│   │   └── PackContext.ts        # Shared aggro state
│   └── utils/
│       └── AmbushVFX.ts          # Server-side visual state/timing
└── client/
    └── controllers/
        └── AmbushVisualizer.ts   # Client-side VFX handler
```

**Structure Decision**: Standard Flamework Service/Controller split with shared config and pure logic separation.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Custom ModelPool | Performance | `Instance.new` causes frame spikes; no external lib in deps. |
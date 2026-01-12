# Implementation Plan: Save Player Progression

**Branch**: `012-save-player-progression` | **Date**: 2026-01-12 | **Spec**: [specs/012-save-player-progression/spec.md](./spec.md)
**Input**: Feature specification from `specs/012-save-player-progression/spec.md`

## Summary

Implement a custom `PlayerDataService` wrapping Roblox `DataStoreService` to persist player progression (Levels, XP, Loadouts). This service will handle session locking, autosaving, and data serialization for multiple class archetypes per player.

## Technical Context

**Language/Version**: TypeScript (roblox-ts 2.3+) -> Luau
**Primary Dependencies**: `@flamework/core`, `@rbxts/services`, `@rbxts/t`
**Storage**: Roblox DataStoreService
**Testing**: Vitest (Logic), Manual (Persistence)
**Target Platform**: Roblox Server
**Project Type**: Game Server
**Performance Goals**: <1s load time, <5s save time, handle standard DataStore limits.
**Constraints**: 4MB entry limit, 60+NumPlayers*10 req/min write limit.
**Scale/Scope**: All players, persistent indefinitely.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Modular Architecture**: ✅ Service-based architecture via Flamework.
- **Pure Game Logic**: ✅ Data shape and default values defined in shared pure modules.
- **Test-Driven Quality**: ✅ Vitest setup available.
- **Clean Code**: ✅ Adhering to project conventions.

## Project Structure

### Documentation (this feature)

```text
specs/012-save-player-progression/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Usage guide
├── contracts/           # Shared interfaces
└── tasks.md             # Implementation tasks
```

### Source Code

```text
src/
├── shared/
│   └── data/
│       └── profiles.ts        # Data interfaces and defaults
├── server/
│   └── services/
│       └── PlayerDataService.ts # Main logic: Load, Save, Autosave
└── client/
    └── controllers/
        └── PlayerDataController.ts # Client view (optional for now, mainly sync)
```

**Structure Decision**: Standard Flamework Service/Controller pattern.
# Implementation Plan: IronGuard Mercs (Full Game)

**Branch**: `004-dungeon-generation` (Scope Expanded to Full Game Foundation) | **Date**: 2026-01-06
**Spec**: [spec.md](./spec.md) (Reflects Dungeon Gen, but Plan covers full architecture)
**Input**: User architecture pivot (roblox-ts, Flamework, Vitest).

## Summary

This plan establishes the foundation for the full IronGuard Mercs game using a modern **roblox-ts** stack. While the immediate feature is "Dungeon Generation", this plan implements the broader architecture: **Flamework** for DI, **Vitest** for pure-logic testing, and a reactive state model. The Dungeon Generator will be implemented as a pure-logic subsystem within `src/shared/algorithms`, driven by a `DungeonService` on the server.

## Technical Context

**Language/Version**: TypeScript (roblox-ts -> Luau).
**Primary Dependencies**: 
-   `@flamework/core`, `@flamework/networking` (Architecture)
-   `@rbxts/services` (Roblox API)
-   `typescript-rx` (State/Event streams)
**Storage**: Runtime memory for match state; DataStore (later) for persistence.
**Testing**: **Vitest** (running in Node.js) for all pure logic in `src/shared`.
**Target Platform**: Roblox Client/Server.
**Performance Goals**: Match start (Gen + Init) < 2s.
**Constraints**: Deterministic Seeded Runs, CI Coverage Gate.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Modular Architecture**: Strict separation of Domain (types), Algorithms (pure logic), and Services (Roblox glue).
- [x] **Test-Driven Quality**: Vitest enables fast TDD for the complex procedural generation logic without starting Studio.
- [x] **Documentation First**: Plan updated to reflect full stack.
- [x] **Clean Code**: TypeScript interfaces ensure strict contracts between Client/Server/Shared.

## Project Structure

### Documentation

```text
specs/004-dungeon-generation/
├── plan.md              # This file
├── research.md          # Architecture decisions
├── data-model.md        # Core entities (Run, Match, Dungeon)
├── quickstart.md        # Dev env setup (npm, rojo)
└── contracts/           # Network definitions (Remotes)
```

### Source Code (repository root)

```text
src/
├── shared/
│   ├── domain/             # Types: RunConfig, LootTable, TileDef
│   ├── algorithms/         # Pure Logic (TESTED HERE):
│   │   ├── rng.ts          # Seeded Random
│   │   ├── dungeon-gen.ts  # The Connector-Based Algorithm
│   │   └── loot.ts         # Loot distribution logic
│   └── net.ts              # Flamework Network Definitions
├── server/
│   ├── services/           # Flamework Services:
│   │   ├── MatchService.ts # Orchestrates the Game Loop
│   │   └── DungeonService.ts # Wraps dungeon-gen.ts + Spawns Models
│   └── cmpts/              # Components (Tags)
├── client/
│   ├── controllers/        # Flamework Controllers
│   └── ui/                 # Roact/Fusion UI
└── index.spec.ts           # Test entry point
```

## Phases

### Phase 0: Foundation
- Initialize `package.json`, `tsconfig.json`, `wally.toml`, `rojo.json`.
- Install Flamework, Vitest.
- Create directory structure.

### Phase 1: Pure Logic (The "Brain")
- Implement `src/shared/algorithms/rng.ts` (Seeded RNG).
- Implement `src/shared/algorithms/dungeon-gen.ts` (The Generator).
- **Test**: Write Vitest specs to verify graph connectivity and determinism *without* Roblox API.

### Phase 2: Server Services (The "Body")
- Implement `DungeonService` to consume the generated graph and place Roblox models (`assets/Tiles`).
- Implement `MatchService` to manage the Run state (Start -> Play -> End).

### Phase 3: Client & UI
- Implement basic Camera/Input controllers.
- Hook up "Start Match" UI to trigger the server loop.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| roblox-ts | Type Safety, NPM ecosystem | Lua is loosely typed; large complex logic (Gen) needs static analysis. |
| Flamework | Dependency Injection | Manual wiring scales poorly for full games. |
| Vitest    | Fast Logic Testing | Testing inside Studio is slow and clunky for pure algorithms. |
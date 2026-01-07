# Implementation Plan: Core Gameplay Vertical Slice

**Branch**: `001-core-gameplay` | **Date**: 2026-01-06
**Spec**: [spec.md](./spec.md) (Vision)
**Input**: Vertical Slice Definition (Arena Clear Mode).

## Summary

This plan defines the first playable "vertical slice" of IronGuard Mercs. The goal is to ship a complete end-to-end real-time co-op game loop: Lobby -> Deployment -> Active Engagement -> Extraction -> Rewards -> Lobby. It establishes the authoritative server architecture, deterministic procedural generation foundation, and testing pipeline.

## Technical Context

**Language/Version**: TypeScript (roblox-ts -> Luau).
**Architecture**: Flamework (DI, Networking, Components).
**State Management**: `typescript-rx` (Reactive Event Streams).
**Testing**: **Vitest** (Node.js) for pure logic; TestEZ for Roblox integration.
**Target Platform**: Roblox Client/Server.
**Performance Goals**: Session start < 3s.
**Constraints**: Deterministic seeded runs, Server-authoritative state.

## Constitution Check

- [x] **Modular Architecture**: Strict separation of Pure Logic (`src/shared`) vs Roblox Services (`src/server`).
- [x] **Test-Driven Quality**: Core logic (RNG, State Machine, Layout Plan) tested via Vitest.
- [x] **Iterative Delivery**: Delivering a minimal "Arena Clear" mode first.

## Project Structure

### Source Code (repository root)

```text
src/
├── shared/
│   ├── domain/             # RunConfig, MatchState, Entities
│   ├── algorithms/         # Pure Logic (TESTED HERE):
│   │   ├── rng.ts          # Seeded Random
│   │   ├── run-state.ts    # State Machine Logic
│   │   └── world-plan.ts   # Minimal ProcGen Logic
│   └── net.ts              # Flamework Network Contracts
├── server/
│   ├── services/           # Flamework Services:
│   │   ├── RunService.ts   # Owns State Machine & Lifecycle
│   │   ├── ProcgenService.ts # Generates "World Plan"
│   │   ├── WorldSpawner.ts # Instantiates Roblox Models
│   │   ├── SpawnService.ts # Places Players/Enemies
│   │   ├── CombatService.ts # Minimal Damage/Death
│   │   └── RewardsService.ts # Calculates/Grants Rewards
│   └── cmpts/              # Server Components
├── client/
│   ├── controllers/        # Flamework Controllers:
│   │   ├── MatchController.ts # Client State Mirror
│   │   └── HudController.ts   # Lobby/Run UI
│   └── ui/                 # Roact/Fusion roots
```

## Game Loop (RunStateMachine)

1.  **Lobby**: Players wait, select mode (Default: Arena Clear).
2.  **Generating**: Server creates `RunConfig` (Seed) and `WorldPlan`.
3.  **Spawning**: Map instantiated, Players teleported.
4.  **Playing**: Enemies spawn, Combat active. Includes real-time HP/Damage/Cooldowns.
5.  **Ending**: Win/Lose determined.
6.  **Results**: Rewards calculated, summary shown. Return to Lobby.

## Phases

### Phase 0: Foundation
- Repo setup (roblox-ts, Rojo, Flamework, Vitest).
- CI/CD pipeline configuration (Coverage Gate).

### Phase 1: Shared Domain & Logic
- Implement `RNG` and `RunStateMachine` (Pure).
- Implement `WorldPlan` generator (Minimal Arena).
- **Test**: Vitest specs for state transitions and determinism.

### Phase 2: Server Architecture
- Implement `RunService` (Orchestrator).
- Implement `ProcgenService` + `WorldSpawner` (Physical Map).
- Implement `SpawnService` (Player placement).

### Phase 3: Gameplay Loop
- Implement `CombatService` (Real-time HP/Damage/Cooldown hooks).
- Implement `RewardsService` (Placeholder coins).
- Wire up Win/Lose triggers.

### Phase 4: Client Experience
- Lobby UI (Start Button).
- HUD (State Indicator).
- Results Screen (Stats/Rewards).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| roblox-ts | Type Safety | Lua typing is insufficient for complex state machines. |
| Reactive  | State Sync | Polling state is inefficient and prone to desync. |

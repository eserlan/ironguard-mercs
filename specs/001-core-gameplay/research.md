# Research & Decisions: Vertical Slice

**Feature**: 001-core-gameplay

## Game Design Decisions

### 1. Game Mode: Arena Clear
**Decision**: MVP is a single generated arena (or 3-room chain) with fixed enemy waves.
**Rationale**:
- Minimizes ProcGen complexity (focus on "working pipeline" vs "complex dungeon").
- Validates the core combat loop immediately.

### 2. Networking Model
**Decision**: Authoritative Server, Reactive Client.
**Contracts**:
- `RequestStartRun` (Client -> Server)
- `RunStateChanged` (Server -> Client)
- `Results` (Server -> Client)
**Rationale**:
- Client is strictly an observer/input-device. Prevents cheating.

### 3. Procedural Generation Scope
**Decision**: Minimal implementation. Generate a "WorldPlan" (data) -> Spawn Models.
**Constraints**:
- Single floor (Y=0).
- Must emit `PlayerSpawn` and `EnemySpawn` nodes.
**Rationale**:
- Separates Logic from Instantiation (allows unit testing the plan generation).

### 4. Combat Scope (MVP)
**Decision**: Minimal Damage/Death.
- Server owns HP.
- Basic hit registration.
**Rationale**:
- Don't block the "Loop" on complex abilities (left for `002-combat`).

## Architecture Decisions

### 1. State Machine
**Decision**: Explicit `RunStateMachine` class (Pure Logic).
**States**: `Lobby` -> `Generating` -> `Spawning` -> `Playing` -> `Ending` -> `Results`.
**Rationale**:
- Essential for managing the flow transitions cleanly. Testable in Node.

### 2. Testing Strategy
**Decision**: Vitest for all `src/shared/algorithms`.
**Coverage Target**: High coverage on RNG, State Machine, and World Plan logic.
**Rationale**:
- Ensure the "Brain" works before attaching the "Body" (Roblox parts).
# Research & Decisions: Full Game Architecture

**Date**: 2026-01-06
**Scope**: Full Game + Dungeon Gen Subsystem

## Architecture Decisions

### 1. Language: TypeScript (roblox-ts)
**Decision**: Use `roblox-ts` to compile TypeScript to Luau.
**Rationale**:
- **Type Safety**: Critical for complex systems like procedural generation and networking.
- **Ecosystem**: Access to `npm` packages (Vitest, RxJS).
- **Tooling**: Superior refactoring and linting compared to raw Luau.

### 2. Framework: Flamework
**Decision**: Use Flamework for Dependency Injection and Networking.
**Rationale**:
- **Zero-Boilerplate Networking**: Define interfaces, get type-safe Remotes automatically.
- **Service/Controller Pattern**: Enforces good separation of concerns.
- **Components**: Tag-based logic handling for game objects.

### 3. Testing: Vitest (Node.js)
**Decision**: Run unit tests for `src/shared` logic in Node.js using Vitest.
**Rationale**:
- **Speed**: Tests run instantly, no Studio startup required.
- **Isolation**: Forces "Pure Logic" separation. If logic depends on `Workspace`, it can't be tested in Node easily, which encourages keeping the core algorithms pure.
- **CI/CD**: Easy to run in standard pipelines.

### 4. Dungeon Generation Strategy
**Decision**: Split into **Pure Logic** vs **Physical Instantiation**.
- **Pure Logic** (`dungeon-gen.ts`): Input `Seed` -> Output `Graph { nodes, edges }`. Verified via Vitest.
- **Physical** (`DungeonService.ts`): Input `Graph` -> Output `Roblox Models`. Verified via Integration Tests.
**Rationale**:
- Allows testing the hard math parts without the lag/complexity of the Roblox engine.

## Open Questions Resolved
- **Tech Stack**: Confirmed roblox-ts + Flamework.
- **Testing**: Confirmed Vitest for logic.
- **Verticality**: Confirmed 2D Layout / 3D Look for MVP.

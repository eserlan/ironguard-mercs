# Implementation Plan: Monsters & Opponents

**Branch**: `006-monster-concept` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: "Define and implement the core enemy system, including combat rules, authoring schema, initial roster, encounter composition, and balance tuning."

## Summary

This plan outlines the implementation of the Monsters & Opponents system. It establishes a data-driven authoring pipeline for enemies, a role-based targeting scoring system (Blended Weighting), and a hybrid interrupt/break mechanic. The system ensures that all enemies are readable, telegraphed, and provide meaningful counterplay in a co-op environment.

## Technical Context

**Language/Version**: TypeScript (roblox-ts)
**Architecture**: Flamework (DI, Services, Components)
**Reactive Flow**: `typescript-rx` for telemetry and state observation.
**Testing**: Vitest (pure scoring and state logic), TestEZ (combat integration).
**Target Platform**: Roblox Client/Server.
**Performance Goals**: Support for 50+ active enemies with minimal AI overhead.
**Constraints**: 
- Server-authoritative AI state and targeting.
- Deterministic stagger and break thresholds.
- Client-side telegraph rendering for responsiveness.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Modular Architecture**: AI logic isolated in `src/shared/algorithms/enemies`.
- [x] **Test-Driven Quality**: Target scoring and Break Meter logic will be unit-tested in Node.js.
- [x] **Documentation First**: This plan and spec precede implementation.
- [x] **Iterative Delivery**: Phased rollout from core rules to golden roster.

## Project Structure

### Documentation

```text
specs/006-monster-concept/
├── plan.md              # This file
├── research.md          # AI scoring and interrupt research
├── data-model.md        # Enemy schemas and state definitions
├── quickstart.md        # Authoring guide
└── contracts/           # Telegraph and AI telemetry remotes
```

### Source Code

```text
src/
├── shared/
│   ├── domain/
│   │   └── enemies/        # EnemyArchetype, MoveConfig, Tier schemas
│   ├── algorithms/
│   │   └── enemies/        # Pure Logic (TESTED):
│   │       ├── target-scoring.ts  # Blended weighting logic
│   │       ├── break-logic.ts     # Break meter and stagger math
│   │       └── ai-state.ts        # FSM logic (Engage, Pressure, etc.)
│   └── net.ts              # Telegraph events and AI debug signals
├── server/
│   ├── services/
│   │   ├── EnemyService.ts     # Orchestrates AI updates and spawning
│   │   ├── TelegraphService.ts # Manages authoritative wind-ups
│   │   └── AIController.ts     # Handles instance-specific AI behaviors
│   └── components/
│       └── EnemyComponent.ts   # Binds AI logic to NPC Models
├── client/
│   ├── controllers/
│   │   ├── TelegraphController.ts # Renders ground markers and VFX
│   │   └── EnemyVFXController.ts  # SILHOUETTE and Motif handling
```

## Phases (Derived from Input)

### Phase 1: Enemy Contract (Core Rules)
- Define `Wind-up`, `Impact`, and `Aftermath` time standards.
- Implement `BreakMeter` logic and `Stagger` state management.
- Implement `TargetScore` algorithm with role-based floors.

### Phase 2: Content Schema
- Define `EnemyArchetype` JSON/TS schema.
- Implement `MoveRegistry` using the 003 Effect Block system.
- Document authoring guidelines for "signature reads".

### Phase 3: Golden Set Roster
- Author 8 initial archetypes (Bruiser, Assassin, Artillery, etc.).
- Implement 1–2 variants (e.g., "Armoured" with higher Break threshold).

### Phase 4: Encounter Composition
- Implement `DifficultyBudgetService` for room population.
- Define role-mix constraints (e.g., max 2 Assassins concurrently).

### Phase 5: Playtest & Tuning
- Add telemetry for TTK, interrupt success, and stagger uptime.
- Performance profiling for AI pathfinding/scoring.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Blended Weighting | Smart Tanking | Basic aggro feels artificial; Role-only ignores the Protector. |
| Break Meter | Boss Pacing | Simple interrupts trivialise big bosses; HP-based interrupts vary with gear. |
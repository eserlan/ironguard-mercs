# Research & Decisions: Progression & Level Up

**Date**: 2026-01-06
**Feature**: Progression & Level Up (007)

## Technical Decisions

### 1. Deterministic Reward Generation
**Decision**: Use a per-player sub-seed derived from `GlobalSeed + UserId`.
**Rationale**: 
- Ensures that if two players level up at the same time, they get different (but deterministic) sets of choices.
- Allows for bug reproduction: if a specific choice set is broken, it can be replicated using the seed.

### 2. Time Scaling (Micro Slow)
**Decision**: Client-side `TweenService` for visual slow + Server-side `Task.wait` scaling.
**Rationale**: 
- **Server**: Adjusts any timed logic (e.g., enemy recovery, DOT ticks) by the slow factor.
- **Client**: Smoothly slows down animations and VFX locally to provide the "feeling" of slow motion.
- **Limit**: Only one player can trigger Micro Slow at a time to prevent exploit stacking.

### 3. XP Event Bus
**Decision**: `typescript-rx` Observables.
**Rationale**: 
- Allows `ProgressionService` to subscribe to `CombatService.Deaths$` and `MatchService.Milestones$` without creating tight coupling.
- Easy to pipe filters (e.g., "only Elites count for bonus XP").

## Unknowns & Research Tasks

### 1. DataStore Churn
- **Research**: Best practice for saving Meta-XP without hitting DataStore limits during rapid session ends.
- **Strategy**: Buffer saves; only commit once at the "Results" screen or upon player leave.

### 2. UI Pacing
- **Research**: Does the 8-10s timer feel "fair" during intense combat? 
- **Goal**: Tune the "Micro Slow" intensity so that 8 seconds is enough time to read 3 tooltips.

## Open Questions Resolved
- **Q1: Co-op Pacing**: Tiered (Safe Rooms + Micro Slow).
- **Q2: Progression Model**: Hybrid (Run=Power, Meta=Options).
- **Q3: Catch-up Logic**: Team Power Level (Shared XP).

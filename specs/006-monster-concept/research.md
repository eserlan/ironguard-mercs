# Research & Decisions: Monsters & Opponents

**Date**: 2026-01-06
**Feature**: Monsters & Opponents (006)

## Technical Decisions

### 1. Telegraph Rendering
**Decision**: Hybrid decal and part-based markers.
**Rationale**: 
- **Decals/Textures**: Best for complex patterns (circles, cones) on flat terrain.
- **Translucent Parts/Beams**: Better for height visibility and 3D boundaries.
- **Optimization**: Use a client-side `TelegraphPool` to reuse instances and minimize memory churn.

### 2. AI Scoring Frequency
**Decision**: Throttled / Bucket-based updates.
**Rationale**: 
- Recalculating scores for every enemy every frame is O(N*M).
- **Strategy**: Update `TargetScore` at 5-10Hz (variable by tier). Minions update less frequently than Bosses. Use `RunService.Heartbeat` with a round-robin scheduler.

### 3. Hazard State Machine
**Decision**: Pattern-based (Resolved Q3).
**Rationale**: 
- Hazards (turrets, vents) don't need "Reposition" or "Recover" in the same way as mobile units.
- **Structure**: Uses a simplified `Timer` loop: `Wait` -> `Telegraph` -> `Fire` -> `Cooldown`.

## Unknowns & Research Tasks

### 1. NavMesh Compatibility
- **Research**: Does Roblox's `PathfindingService` handle 50+ dynamic updates well within modular 2D layouts?
- **Goal**: Establish a fallback pathing mode (Simple MoveTo) for Swarm units if NavMesh stalls.

### 2. Audio Spatialization
- **Research**: Best practice for signposting "off-screen" telegraphs (Assassin sounds, Artillery whistles).
- **Goal**: Ensure co-op readability even when the threat is behind the player.

## Open Questions Resolved
- **Q1: Interrupt Model**: Hybrid (Soft/Hard casts).
- **Q2: Targeting**: Blended Scoring with Role Floors.
- **Q3: Hazards**: Pattern-based (simplified).

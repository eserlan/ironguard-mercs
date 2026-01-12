# Research: Monster Spawning & Encounter Design

**Feature**: Monster Spawning (011)
**Date**: 2026-01-11
**Status**: Completed

## 1. Object Pooling Strategy

**Problem**: Spawning and destroying distinct Roblox Models for every enemy wave causes frame spikes (instantiation lag) and GC pressure.
**Options**:
A. `Instance.new` / `Clone()` every time (Baseline).
B. External Library (e.g., PartCache).
C. Custom `ModelPool` class.

**Decision**: **Option C (Custom ModelPool)**.
**Rationale**:
- `package.json` shows no existing pooling library.
- We need strict typing and integration with our Enemy Entity structure.
- Implementation is simple (~50 LOC): `Get()` pops from array or clones template; `Return()` pivots to cache CF and pushes to array.

## 2. Spawn Metadata Format

**Problem**: How does the Dungeon Generator (004) tell the Spawner (011) *where* and *what* to spawn?
**Options**:
A. Naming Convention (e.g., part named `Spawn_Elite_Melee`).
B. ConfigurationFolder inside the part.
C. Roblox Attributes.

**Decision**: **Option C (Roblox Attributes)**.
**Rationale**:
- Native support in Studio (easy to edit tiles).
- Faster lookup than iterating children.
- defined in Spec 011: `Type` (string), `Tier` (string), `Ambush` (boolean).

## 3. Ambush & Visuals (Top/Bottom Design)

**Problem**: How to implement the "VFX Transition" for ambushes without bloating server logic?
**Context**: Constitution Principle III (Top/Bottom Ability Design) suggests separating logic from visuals.

**Decision**: **Replicate State, Animate Client**.
- **Server**: Sets Enemy State to `Spawning` (with a timestamp). Logic "exists" but AI is paused.
- **Client**: Observes `Spawning` state. Plays "Burrow/Portal" effect at that location.
- **Transition**: After `SpawnDuration` (e.g., 2s), Server switches State to `Active`. AI starts. Client shows actual model / health bar.

## 4. Aggro Linking (Pack Logic)

**Problem**: How to link enemies efficiently?
**Decision**: **Shared Reference**.
- All enemies in a pack hold a reference to a shared `PackContext` object in memory.
- When one enters combat, it calls `PackContext:AlertAll()`.
- No spatial queries needed at runtime.

## 5. Technology Stack Validation

- **Language**: Luau (Verified).
- **Framework**: Flamework (Verified).
- **Testing**: TestEZ (Verified).
- **Persistence**: Not required for this feature (Runtime only).

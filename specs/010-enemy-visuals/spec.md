# Humanoid Enemy Visual Pipeline (MVP)

**Status**: Draft
**Owner**: Espen
**Created**: 2026-01-11
**Feature Branch**: `010-enemy-visuals`
**Input**: User description: "Implement a minimal, reusable system for spawning humanoid enemy NPCs in Roblox using a single R15 rig and data-driven visual profiles."

## Summary

This feature implements a minimal, reusable system for spawning humanoid enemy NPCs using a single shared R15 rig and data-driven visual profiles. By leveraging `HumanoidDescription` and catalog assets, we enable rapid iteration of enemy designs without custom modeling or per-variant rigs, adhering to a "lock the pipeline early" philosophy.

## Problem / Why

The current workflow for creating enemies is undefined or manual, which poses a risk of "scope creep" through custom modeling and rigging. To scale the enemy roster efficiently as a solo developer, we need a system that:
1.  **Eliminates Repetition**: Uses one shared rig for all humanoids.
2.  **Locks Scope**: Prevents the need for custom meshes or Blender work.
3.  **Enables Speed**: Allows new enemy variants to be created purely through data configuration.

## Proposal / What

We will implement a data-driven pipeline where an enemy's appearance is defined by a "Visual Profile" separate from its combat logic. At spawn time, the system will apply this profile to a base R15 rig using `HumanoidDescription`.

### User Scenarios & Testing

#### User Story 1 - Data-Only Enemy Creation (Priority: P1)
**Description**: A developer creates a new "Void Guard" enemy by defining a JSON visual profile (referencing a helmet and dark colors) and linking it to a new enemy ID.
**Value**: Proves the "no code changes" and "no custom modeling" constraints.
**Independent Test**: Create a new Visual Profile and Enemy definition. Spawn the enemy. Verify it wears the expected assets and colors.
**Acceptance Scenarios**:
1. **Given** a valid Visual Profile with an asset ID (e.g., a helmet), **When** an enemy referencing this profile is spawned, **Then** the enemy model appears with the helmet attached.
2. **Given** a Visual Profile with `bodyColors` overrides, **When** spawned, **Then** the enemy's skin tone matches the profile.

#### User Story 2 - Visual Distinction & Scaling (Priority: P2)
**Description**: Two enemies of different types (e.g., "Grunt" vs "Brute") are spawned. The "Brute" is visibly larger and wears different gear.
**Value**: Ensures enemies are distinguishable by silhouette and color, meeting the 0.5s recognition quality bar.
**Independent Test**: Spawn a standard size enemy and a scaled-up enemy side-by-side.
**Acceptance Scenarios**:
1. **Given** a Visual Profile with `height: 1.2`, **When** spawned, **Then** the enemy model is 20% taller than the base rig.
2. **Given** two distinct profiles, **When** spawned together, **Then** they have distinct silhouettes or color palettes.

### Requirements

#### Functional
- **FR-001**: The system MUST use a single shared R15 humanoid rig for all enemies, cloned from `ServerStorage/EnemyRigs/EnemyBaseR15`.
- **FR-002**: The system MUST apply visual variety via `HumanoidDescription`, strictly using catalog asset IDs and body colors.
- **FR-003**: The system MUST support attaching a weapon model to the enemy, referenced by a `weaponKey`.
- **FR-004**: The system MUST apply scaling (height, width, depth) via `HumanoidDescription` properties.
- **FR-005**: The visual setup process MUST be idempotent and deterministic (same input = same look).
- **FR-006**: Enemy combat logic MUST remain independent of the visual setup; visuals are purely cosmetic.

#### Key Entities
- **VisualProfile**: A data structure defining `assetIds` (array of numbers), `bodyColors` (optional), `scale` (optional), and clothing templates.
- **EnemyVisualConfig**: An extension to the existing Enemy data model containing `rigType: "R15"`, `visualProfileKey`, `weaponKey`, and `animationSetKey`.
- **EnemyVisualService**: The service responsible for the runtime application of the profile to the rig.

### Edge Cases
- **Asset Failure**: If a catalog asset fails to load, the enemy should spawn without it rather than stalling.
- **Invalid Key**: Referencing a missing `visualProfileKey` should result in a fallback appearance (e.g., a default grey "dummy" look) and a logged warning.

## Technical / How

1.  **Storage**:
    -   Base Rig: `ServerStorage/EnemyRigs/EnemyBaseR15`.
    -   Weapons: `ServerStorage/Weapons/[Key]`.
2.  **Data**: Visual profiles are stored in a shared module (e.g., `VisualProfiles.ts`).
3.  **Process**:
    -   `EnemySpawnService` triggers `EnemyVisualService.setup(rig, config)`.
    -   `EnemyVisualService` looks up the profile.
    -   Constructs `HumanoidDescription`.
    -   Applies description to `rig.Humanoid`.
    -   Clones and welds the weapon model.
    -   Sets the animation script/values.

## Risks

- **Asset Loading Latency**: Relying on Roblox catalog assets can cause "pop-in". *Mitigation*: Preload key assets or accept this as a tradeoff for MVP.
- **Scale Physics**: Scaling a humanoid might affect hitboxes or movement. *Mitigation*: Use standard R15 scaling which automatically adjusts HipHeight, but verify navigation.

## Open Questions

- None. The scope is strictly defined by the constraints.

## Success Criteria

- **SC-001**: A new enemy look can be added by editing *only* the data files (no new scripts, no new manual models).
- **SC-002**: Visual setup is distinguishable (enemies look different) within 0.5 seconds of spawning.
- **SC-003**: The implementation uses **zero** custom meshes or Blender-imported character assets.
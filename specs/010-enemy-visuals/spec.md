# Humanoid Enemy Visual Pipeline (MVP) Specification

## Goal
Implement a minimal, reusable system for spawning humanoid enemy NPCs in Roblox using a single R15 rig and data-driven visual profiles.

## Constraints
* **One shared R15 humanoid rig** for all enemies.
* **No Blender/Custom Meshes**: Use `HumanoidDescription`, Accessories (Catalog IDs), and Weapons as separate models.
* **Independent Logic**: Enemy combat logic is decoupled from visuals.
* **Solo-dev Friendly**: Fast iteration via data changes only.

## Non-Goals
* Non-humanoid enemies.
* Procedural meshes or per-enemy animation rigs.
* Visual polish beyond silhouettes and color coding.

## Data Model (Flamework + Roblox TS)

### `EnemyVisualProfile`
```typescript
interface EnemyVisualProfile {
    assetIds: number[]; // Accessories
    shirtTemplateId?: number;
    pantsTemplateId?: number;
    bodyColors?: {
        HeadColor: Color3;
        TorsoColor: Color3;
        LeftArmColor: Color3;
        RightArmColor: Color3;
        LeftLegColor: Color3;
        RightLegColor: Color3;
    };
    scale?: {
        Height?: number;
        Width?: number;
        Depth?: number;
        Head?: number;
    };
}
```

### Extended `EnemyConfig`
```typescript
interface EnemyConfig {
    // ... combat stats ...
    visual: {
        rigType: "R15";
        profileKey: string;
        weaponKey: string;
        animationSetKey: string;
    };
}
```

## Runtime Behavior
1. **Clone Base Rig**: `ServerStorage/EnemyRigs/EnemyBaseR15`.
2. **Apply Visuals**: Construct and apply `HumanoidDescription` from `EnemyVisualProfile`.
3. **Weapon Attachment**: Attach model based on `weaponKey`.
4. **Animation Assignment**: Set override animations.
5. **Handoff**: Let `EnemyController` take over.

## Success Criteria
* New enemies created by data only (no code/model changes).
* Visual separation within 0.5s of sight.

# Research: Humanoid Enemy Visual Pipeline

**Feature**: Humanoid Enemy Visual Pipeline (MVP)
**Status**: Complete
**Date**: 2026-01-11

## 1. HumanoidDescription for Visuals

**Question**: Is `HumanoidDescription` the most robust way to handle this without custom rigs?
**Decision**: Yes.
**Rationale**: 
- Native engine feature designed exactly for this use case.
- Handles all accessory attachments, clothing, and body colors automatically.
- Supports scaling out of the box.
- Eliminates manual `WeldConstraint` logic for hats/armor.
**Alternatives Considered**:
- **Manual Accessory Cloning**: Too brittle; requires manual weld offsets and attachment point matching.
- **Skinned Meshes**: Out of scope (requires Blender).

## 2. Scaling Implementation

**Question**: How do we handle enemy scaling (e.g., larger Elites)?
**Decision**: Use `HumanoidDescription` scale properties (`HeightScale`, `WidthScale`, `DepthScale`, `HeadScale`).
**Rationale**: 
- Automatically adjusts `HipHeight` and motor offsets.
- Works seamlessly with standard R15 animations.
**Constraint**: Extreme scaling (>2x) might break navigation or hitboxes. We will limit scale to 0.8x - 1.5x range in validation.

## 3. Weapon Attachment

**Question**: `HumanoidDescription` doesn't handle hand-held tools/weapons well for NPCs (it expects `Tools` in backpack). How do we attach weapons?
**Decision**: Manual Motor6D/Weld attachment.
**Rationale**:
- NPCs don't typically use the `Tool` instance (which requires a `Humanoid` to equip).
- We want weapons to be static models welded to the `RightHand` or `LeftHand`.
**Pattern**:
1. Clone Weapon Model.
2. Align `Handle` CFrame to `RightHand` CFrame.
3. Create `WeldConstraint` between `Handle` and `RightHand`.
4. Parent to Character.

## 4. Asset Preloading

**Question**: Should we preload assets to avoid "naked" enemies?
**Decision**: No (for MVP).
**Rationale**:
- Preloading adds complexity (ContentProvider).
- "Pop-in" is explicitly accepted in the spec "Risks" section for this MVP.
- Can be added later as a targeted improvement.

## 5. Data Structure

**Decision**: 
```typescript
interface VisualProfile {
    assetIds: number[];
    bodyColors?: { head: Color3, torso: Color3, ... };
    scale?: { height: number, width: number, ... };
    shirtId?: number;
    pantsId?: number;
}
```
**Rationale**: Matches `HumanoidDescription` API surface almost 1:1, minimizing translation logic.

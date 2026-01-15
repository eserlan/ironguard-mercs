# 013 - Melee Animation System

## Overview

This specification defines the **Melee Animation System** for IronGuard Mercenaries. It covers the structure, timing, and configuration of melee attacks, with a focus on:

1. **Marker-Based Animations**: Precise hit windows driven by animation events.
2. **Procedural Fallback**: TweenService-based arm movements when assets are unavailable.
3. **Spatial Arc Detection**: Server-side collision using overlap spheres and angle checks.

---

## Animation Requirements

All melee animations MUST include the following **KeyframeMarker** events:

| Marker          | Purpose                                      |
|-----------------|----------------------------------------------|
| `WindupStart`   | Beginning of the attack windup               |
| `HitStart`      | Start of the active hit window               |
| `HitEnd`        | End of the active hit window                 |
| `RecoverStart`  | Start of recovery (vulnerable)               |
| `End`           | Animation complete, ready for next action    |

### Naming Convention

`{AttackType}_{Direction}_{Variant}`

Examples:
- `Light_Slash_LR` (Light attack, Left-to-Right)
- `Heavy_Overhead_01` (Heavy attack, Overhead, variant 1)
- `Light_Stab_RL` (Light thrust, Right-to-Left)

---

## MeleeProfile Configuration

Each melee attack is defined by a `MeleeProfile` in `src/shared/domain/combat/config.ts`:

```typescript
export interface MeleeProfile {
    animId: string;              // rbxassetid://... or empty for procedural-only
    playbackSpeed: number;       // Animation speed multiplier
    range: number;               // Studs from character pivot
    arcDegrees: number;          // Horizontal arc (90 = front quarter)
    impact: number;              // Stagger/break contribution
    damage: number;              // Relative damage multiplier
    hitWindow: [number, number]; // [start, end] in seconds (fallback timing)
    canInterruptSoftCasts: boolean;
    canBreakHardCasts: boolean;
}
```

### Example: Light Sword Swing

```typescript
export const LightSwordSwing: MeleeProfile = {
    animId: "rbxassetid://YOUR_ASSET_ID",
    playbackSpeed: 1.0,
    range: 7,
    arcDegrees: 90,
    impact: 1,
    damage: 1.0,
    hitWindow: [0.18, 0.32],
    canInterruptSoftCasts: true,
    canBreakHardCasts: false,
};
```

---

## Attack Categories

| Category | Speed    | Arc     | Impact | Use Case                      |
|----------|----------|---------|--------|-------------------------------|
| Light    | Fast     | 90°     | Low    | Pressure, combo starters      |
| Heavy    | Slow     | 120°    | High   | Stagger, combos finishers     |
| Thrust   | Medium   | 45°     | Medium | Single-target precision       |
| Spin     | Slow     | 360°    | Medium | AoE crowd control             |

---

## Client-Side Behaviour (VFXController)

### Priority Order

1. **Animation Asset** (if available and loadable)
   - Subscribe to marker signals (`HitStart`, etc.)
   - Execute VFX on markers
2. **Procedural Fallback** (always available)
   - Tween `RightShoulder.C0` for arm swing
   - Spawn neon slash effect at character pivot
   - Use `hitWindow[0]` for timing

### Current Implementation

Due to asset permission restrictions, the system currently uses **procedural-only** mode. When you upload your own animations:

1. Update `animId` in the `MeleeProfile`
2. Re-enable the animation loading code in `VFXController.spawnMeleeSwing`
3. Ensure markers are properly placed in the Animation Editor

---

## Server-Side Behaviour (CombatService)

### Spatial Arc Detection

```typescript
resolveMeleeArc(player, character, profile, direction):
    1. Get all parts within profile.range using overlapSphere
    2. For each unique Model found:
        a. Calculate DOT product: lookDir.Dot(toTarget)
        b. Compare against cos(arcDegrees / 2)
        c. If within arc, resolve hit via resolveHit()
```

### Hit Window Synchronization

The server schedules damage resolution at `hitWindow[0]` seconds after receiving the intent:

```typescript
task.delay(profile.hitWindow[0], () => {
    this.resolveMeleeArc(player, character, profile, direction);
});
```

This ensures client VFX and server damage are synchronized.

---

## Combo System (Future)

### Planned Chain Structure

```
Light1 → Light2 → Heavy (Finisher)
   ↓
 Thrust (Alternate)
```

### Input Buffer

- Buffer window: `0.3s` before attack ends
- Chain detection: Next attack input within buffer triggers combo
- Recovery cancel: Heavy attacks can be cancelled into dodge

---

## Design Principles

1. **Readability**: Horizontal slashes are easier to track in co-op
2. **Commitment**: All attacks have recovery frames (no instant cancels)
3. **Scalability**: Same system works for daggers (fast) to greatswords (slow)
4. **Reliability**: Procedural fallback ensures feedback even without assets
5. **Authority**: Server controls damage; client controls visuals

---

## Files

| File                                          | Purpose                           |
|-----------------------------------------------|-----------------------------------|
| `src/shared/domain/combat/config.ts`          | MeleeProfile definitions          |
| `src/client/controllers/VFXController.ts`     | Client-side swing visuals         |
| `src/server/services/CombatService.ts`        | Hit resolution & damage           |
| `src/server/services/HitDetectionService.ts`  | Spatial queries                   |
| `src/shared/utils/Maid.ts`                    | Resource cleanup                  |

---

## Next Steps

- [ ] Upload custom `Light_Slash_LR` animation with markers
- [ ] Implement combo chain (Light → Light → Heavy)
- [ ] Add stagger/break meter integration
- [ ] Create Heavy attack profile
- [ ] Implement recovery cancelling via dodge

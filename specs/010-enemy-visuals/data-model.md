# Data Model: Humanoid Enemy Visual Pipeline

## Entities

### 1. EnemyVisualProfile
**Type**: Shared Data Interface
**Purpose**: Defines the visual appearance of a humanoid enemy.
**Location**: `src/shared/domain/enemies/visual-types.ts`

```typescript
export interface EnemyVisualProfile {
    /** List of Catalog Asset IDs (Hats, Shoulders, Face, etc.) */
    assetIds: number[];
    
    /** Optional Shirt Template ID */
    shirtTemplateId?: number;
    
    /** Optional Pants Template ID */
    pantsTemplateId?: number;
    
    /** Body Color Overrides */
    bodyColors?: {
        head?: Color3;
        torso?: Color3;
        leftArm?: Color3;
        rightArm?: Color3;
        leftLeg?: Color3;
        rightLeg?: Color3;
    };
    
    /** Scale Factors (Default: 1.0) */
    scale?: {
        height?: number;
        width?: number;
        depth?: number;
        head?: number;
    };
}
```

### 2. EnemyVisualConfig
**Type**: Component Interface (part of EnemyArchetype)
**Purpose**: Links an enemy definition to a visual profile and weapon.
**Location**: `src/shared/domain/enemies/config.ts` (Extension)

```typescript
export interface EnemyVisualConfig {
    readonly rigType: "R15";
    /** Key referencing a profile in the VisualProfiles registry */
    readonly profileKey: string;
    /** Key referencing a model in ServerStorage/Weapons */
    readonly weaponKey?: string;
    /** Key referencing an animation set (existing system) */
    readonly animationSetKey?: string;
}
```

### 3. VisualProfiles Registry
**Type**: Constant Map
**Purpose**: Central registry of all named visual profiles.
**Location**: `src/shared/domain/enemies/visual-profiles.ts`

```typescript
import { EnemyVisualProfile } from "./visual-types";

export const VisualProfiles: Record<string, EnemyVisualProfile> = {
    "VoidGrunt": {
        assetIds: [12345678, 87654321],
        bodyColors: {
            head: Color3.fromHex("#1a1a1a"),
            torso: Color3.fromHex("#333333"),
        },
        scale: { height: 1.0 },
    },
    // ...
};
```

## Relationships

1.  `EnemyArchetype` (config) **has-one** `EnemyVisualConfig`.
2.  `EnemyVisualConfig` **references** `EnemyVisualProfile` via `profileKey`.
3.  `EnemyVisualConfig` **references** `WeaponModel` via `weaponKey`.

## Validation Rules

1.  `profileKey` MUST exist in `VisualProfiles`.
2.  `scale` values SHOULD be between 0.5 and 2.0 to avoid physics issues.
3.  `assetIds` MUST be valid Roblox Catalog IDs (though runtime check is hard, we assume valid input).

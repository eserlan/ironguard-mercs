# Quickstart: Testing the Enemy Visual Pipeline

## Prerequisites
1.  Ensure you have the project open in Roblox Studio (via Rojo).
2.  Open the Output window to see logs.

## Test Scenarios

### 1. Basic Spawn Test (User Story 1)
**Goal**: Verify an enemy spawns with the correct visual profile.

1.  **Open** `src/shared/data/enemies/minions.ts`.
2.  **Edit** an existing enemy (e.g., `VOID_SWARM`) or create a temp one.
3.  **Set** `visual.profileKey` to `"Slasher"` (or a profile you defined).
4.  **Start** the game (F5).
5.  **Trigger** a wave spawn (or use debug command if available).
6.  **Verify**:
    -   Enemy appears.
    -   Enemy has the accessories defined in `"Slasher"`.
    -   Enemy body colors match.

### 2. Scaling & Distinction Test (User Story 2)
**Goal**: Verify scale properties work.

1.  **Define** a new profile in `src/shared/domain/enemies/visual-profiles.ts`:
    ```typescript
    GiantTest: {
        assetIds: [],
        scale: { height: 1.5, width: 1.5, depth: 1.5 },
        bodyColors: { torso: Color3.fromRGB(255, 0, 0) } // Red
    }
    ```
2.  **Assign** this profile to an enemy type.
3.  **Spawn** the enemy.
4.  **Verify**:
    -   The enemy is significantly larger than the player.
    -   The torso is red.
    -   Hitbox/Navigation allows it to move (basic check).

### 3. Weapon Attachment
**Goal**: Verify weapon appears.

1.  **Ensure** a model exists in `ServerStorage/Weapons/TestBlade`.
2.  **Set** `visual.weaponKey` to `"TestBlade"`.
3.  **Spawn** enemy.
4.  **Verify**:
    -   "TestBlade" is attached to the RightHand.
    -   It moves with the arm during animations.

# Humanoid Enemy Visual Pipeline (MVP) Plan

## Phase 1: Data Definitions
- [ ] Define `EnemyVisualProfile` types in `shared/domain/enemies/types.ts`.
- [ ] Create `shared/domain/enemies/visual-profiles.ts` with initial variants (e.g., Grunt, Elite).
- [ ] Update `EnemyConfig` to include the `visual` property.

## Phase 2: Rig Setup
- [ ] Ensure `ServerStorage/EnemyRigs/EnemyBaseR15` exists (Instruction: User to provide or I create a placeholder).
- [ ] Verify R15 rig is clean (no scripts).

## Phase 3: Runtime Logic (Flamework)
- [ ] Implement `EnemyVisualService` in `server/services/`.
    - `applyProfile(humanoid: Humanoid, profile: EnemyVisualProfile): void`
    - `setupEnemy(rig: Model, config: EnemyConfig): void`
- [ ] Hook into `EnemySpawnService` to trigger visual setup on spawn.

## Phase 4: Verification
- [ ] Create a test command or script to spawn different enemy variants.
- [ ] Verify accessories and colors apply correctly.
- [ ] Verify weapon attachment logic.

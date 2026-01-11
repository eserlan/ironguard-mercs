# Humanoid Enemy Visual Pipeline Tasks

- [ ] **Infrastructure**
    - [ ] Create `shared/domain/enemies/visual-types.ts`
    - [ ] Create `shared/domain/enemies/visual-profiles.ts`
    - [ ] Update `shared/domain/enemies/enemy-types.ts` with profile references

- [ ] **Server Implementation**
    - [ ] Create `server/services/EnemyVisualService.ts`
    - [ ] Implement `HumanoidDescription` builder
    - [ ] Implement asset loading/caching for accessories
    - [ ] Update `EnemySpawnService.ts` to call `EnemyVisualService`

- [ ] **Assets (External/Placeholders)**
    - [ ] Set up `ServerStorage/EnemyRigs` folder structure
    - [ ] Define initial "Slasher" and "Guard" profiles

- [ ] **Verification**
    - [ ] Spawn "Slasher" and verify look
    - [ ] Spawn "Guard" and verify look

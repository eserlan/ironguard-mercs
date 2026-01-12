# Quickstart: Monster Spawning

## How to Add a New Monster Pack

1.  **Define the Enemy**: Ensure `EnemyArchetypes` exist in Feature 006 (or mock them).
2.  **Create Pack Config**: Add a new entry to `src/shared/config/MonsterPacks.ts`.

```typescript
export const ForestWolfPack: MonsterPackDef = {
    id: "forest_wolves_01",
    budgetCost: 15,
    minSize: 3,
    biomeTags: ["Forest"],
    members: [
        { enemyId: "Wolf_Alpha", role: "Elite", count: new NumberRange(1, 1) },
        { enemyId: "Wolf_Pup", role: "Minion", count: new NumberRange(2, 4) }
    ]
};
```

3.  **Register Pack**: Add it to the `PackRegistry` startup list.

## How to Test Spawning

### Unit Tests
Run the test suite:
```bash
npm test -- filter=SpawnDirector
```

### Studio Testing
1.  Open Roblox Studio.
2.  Start a "Play Solo" session.
3.  The `DungeonGenerator` will run automatically.
4.  The `SpawnDirector` will listen for the `DungeonGenerated` event.
5.  **Verify**: Fly around the map. You should see enemies (or placeholders) at `EnemySpot` locations.
6.  **Verify Ambush**: Walk into a room. If an Ambush is configured, watch for the "VFX Transition" before the model appears.

## Troubleshooting

- **No Enemies?**
    - Check Output for "No valid pack found for budget X".
    - Check if `EnemySpot` parts are tagged correctly in the Dungeon Tiles.
- **Clown Car?**
    - Enemies stuck inside each other? `EnemySpot` collision checks might be failing or nodes are too close.

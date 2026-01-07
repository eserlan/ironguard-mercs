# Quickstart: Core Gameplay Validation

## 1. Unit Tests (Logic)
Run all logic tests to ensure algorithms (RNG, State, Rewards, Permadeath) are correct.
```bash
npx vitest run src/shared/algorithms/
```

## 2. Integration Tests (Flow)
Verify the end-to-end mission state transition loop.
```bash
npx vitest run test/integration/mission_flow.spec.ts
```

## 3. Manual Verification (Roblox Studio)
1. Open Studio.
2. Ensure `RunService` and `RosterService` are initialized.
3. Fire `GlobalEvents.server.RequestStartRun` with a seed.
4. Verify `RunStateChanged` broadcast with `Generating` -> `Spawning` -> `Playing`.
5. Check if `CameraController` zoom limits are applied.
6. Verify `HealthComponent` attributes (`Health`, `MaxHealth`) are synced.
7. Trigger a `Defeat` via `RunService.resolveMission("Defeat")` and verify Roster update (Ironman check).

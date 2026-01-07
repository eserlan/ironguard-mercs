# Implementation Plan: Combat System (002)

**Branch**: `002-combat-system` | **Date**: 2026-01-06
**Spec**: [spec.md](./spec.md) (Vision)
**Input**: Vertical Slice Definition (Post-001 Upgrade).

## Summary

This plan upgrades the "minimal" combat of 001 into a robust, extensible framework. It introduces server-authoritative validation, a data-driven damage pipeline, and status effects. The goal is to deliver a secure combat loop with distinct weapon behaviors (Melee vs Hitscan) and clear client feedback, all backed by comprehensive unit tests.

## Technical Context

**Language/Version**: TypeScript (roblox-ts -> Luau).
**Architecture**: Flamework (Services/Components).
**State Management**: `typescript-rx` (Event Streams for combat log/VFX).
**Testing**: **Vitest** (Node.js) for damage math and validation logic.
**Target Platform**: Roblox Client/Server.
**Constraints**: 
-   Server Authoritative (No client trust for damage).
-   Deterministic RNG (Critical hits).
-   Performance (Rate limiting intents).

## Constitution Check

- [x] **Modular Architecture**: Pure combat logic isolated in `src/shared/algorithms/combat`.
- [x] **Test-Driven Quality**: Core math (Damage, Mitigation, Crits) verified via Vitest before Roblox implementation.
- [x] **Clean Code**: Strict typing for `CombatIntent` and `CombatEvent`.

## Project Structure

### Source Code (repository root)

```text
src/
├── shared/
│   ├── domain/combat/      # Types: Combatant, WeaponConfig, DamageResult
│   ├── algorithms/combat/  # Pure Logic (TESTED HERE):
│   │   ├── damage-pipeline.ts # CalculateDamage(attacker, defender, weapon)
│   │   ├── mitigation.ts      # Armor/Resistance math
│   │   └── status.ts          # Tick/Expiry simulation
│   └── net.ts              # Extended Flamework Network Contracts
├── server/
│   ├── services/           # Flamework Services:
│   │   ├── CombatService.ts   # Entry point: Receive Intent -> Validate -> Resolve
│   │   ├── StatusService.ts   # Manage active DOTs/Buffs
│   │   └── WeaponService.ts   # Weapon configs and factory
│   └── cmpts/              # Server Components:
│       └── Hitbox.ts          # Server-side hit detection helpers
├── client/
│   ├── controllers/        # Flamework Controllers:
│   │   ├── CombatController.ts # Input -> Intent -> Local Visuals
│   │   └── EffectsController.ts # Listen to CombatEvent -> Spawn VFX
│   └── ui/                 # Damage Numbers, Health Bars
```

## Combat Loop (Authoritative)

1.  **Intent**: Client sends `CombatIntent` (WeaponID, Direction, Timestamp).
2.  **Validation**: Server checks Cooldown, Distance, Ownership.
3.  **Resolution**: Server performs Hit Detection (Raycast/Overlap) -> Runs Damage Pipeline.
4.  **State**: Apply Damage/Status -> **Death Resolution** (If fatal: Destroy instance).
5.  **Output**: Emit `CombatEvent` (Hit/Crit/Fatal).
6.  **Feedback**: Clients play SFX/VFX based on events.

## Phases

### Phase 0: Foundation Upgrade
- Define `CombatIntent` and `CombatEvent` types (including `isFatal` flag).
- Extend `RunService` to pause combat outside "Playing" state.

### Phase 1: Pure Logic (The "Brain")
- Implement `DamagePipeline` (Base -> Crit -> Mitigation -> **Fatal Check**).
- Implement `StatusSystem` (Duration, Stacks).
- **Test**: Vitest specs for math correctness, edge cases, and fatal damage detection.

### Phase 2: Server Architecture
- Implement `CombatService` (Validation Layer + **Death Orchestration**).
- Implement `WeaponService` (Data-driven configs).
- Implement Server-side Hit Detection (Raycast/Overlap).

### Phase 3: Client Experience
- Implement `CombatController` (Input handling).
- Implement `EffectsController` (Visual feedback).
- UI: Health Bars + Damage Numbers.

### Phase 4: Integration
- Connect `CombatService` to `RunService` (Death triggers).
- Connect `CombatService` to `RewardsService` (Kill credit).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Validation | Anti-Cheat | Client authority is trivial to exploit. |
| Pure Pipeline| Testability | Debugging combat math in Studio is slow/painful. |
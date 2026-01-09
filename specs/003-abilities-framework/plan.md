# Implementation Plan: Abilities Framework (003)

**Branch**: `003-abilities-framework` | **Date**: 2026-01-06
**Spec**: [spec.md](./spec.md) (Vision)
**Input**: Detailed Plan (Effect Blocks, Targeting, Pipeline).

## Summary

This plan implements a scalable, data-driven abilities framework built on reusable "Effect Blocks". It adheres to strict server authority for outcomes while enabling responsive client feedback. The system is designed to support at least 3 archetypes (Dash, Shield, Projectile) end-to-end, integrated with the `002-combat-system`.

## Technical Context

**Language/Version**: TypeScript (roblox-ts -> Luau).
**Architecture**: Flamework (Services/Controllers).
**State**: `typescript-rx` (Event Streams for intents/activations).
**Testing**: **Vitest** (Node.js) for Cooldowns, Validation, and Effect Math.
**Target Platform**: Roblox Client/Server.
**Constraints**: 
-   Server Authoritative (Cooldowns, Targeting, Effects).
-   Data-Driven (Config + Effect Blocks).
-   Active Abilities Only (003 Scope).

## Constitution Check

- [x] **Modular Architecture**: Ability definitions are pure data. Execution logic is shared.
- [x] **Test-Driven Quality**: Core pipeline steps (Validate, Resolve) are pure functions tested in Node.
- [x] **Clean Code**: Strict typing for `AbilityIntent` and `AbilityConfig`.

## Project Structure

### Source Code (repository root)

```text
src/
├── shared/
│   ├── domain/abilities/   # Types: AbilityConfig, AbilityIntent, EffectBlock
│   ├── algorithms/abilities/ # Pure Logic (TESTED HERE):
│   │   ├── cooldowns.ts      # Cooldown/Charge tracking
│   │   ├── validation.ts     # Range/LOS/State checks
│   │   ├── resolver.ts       # Effect Block execution logic
│   │   └── projectiles.ts    # Trajectory math
│   └── net.ts              # Flamework Network Contracts
├── server/
│   ├── services/           # Flamework Services:
│   │   ├── AbilityService.ts # Orchestrator (Pipeline)
│   │   ├── ProjectileService.ts # Spawns/Simulates projectiles
│   │   └── CooldownService.ts # Manages state
│   └── components/abilities/ # Server-side behavior hooks
├── client/
│   ├── controllers/        # Flamework Controllers:
│   │   ├── AbilityController.ts # Input -> Intent
│   │   └── VFXController.ts     # Visuals (Cast/Impact)
│   └── ui/                 # Cooldowns, Reticles
```

## Execution Pipeline (Authoritative)

1.  **Intent**: Client sends `AbilityIntent` (SlotIndex, Action, Seq, TargetPayload).
2.  **Dispatch**: `AbilityService` retrieves loadout, identifies AbilityID, and selects the requested variant (Top/Bottom).
3.  **Validation**: Server checks Player State, Cooldowns (via `SlotCooldownManager`), and Targeting.
4.  **Resolution**: Server resolves `EffectBlocks` defined in the selected variant.
5.  **Output**: Server emits `AbilityActivated` and effect results.

## Phases

### Phase 0: Domain & Schema
- Define `AbilityConfig` with `top`/`bottom` variants.
- Define `AbilityIntent` with `slotIndex` and `action`.

### Phase 1: Pure Logic (The "Brain")
- Implement `SlotCooldownManager` (Pure).
- Implement `IntentValidator` (Pure).
- **Test**: Vitest specs for slot-based cooldowns and variant-specific validation.

### Phase 2: Server Runtime
- Implement `AbilityService` (Pipeline).
- Implement `ProjectileService` (Physical simulation).
- Integrate with `CombatService` (Damage/Status effects).

### Phase 3: Client Experience
- Implement `AbilityController` (Input & Intent).
- Implement `VFXController` (Optimistic Cast + Authoritative Impact).
- **UI: The Sacred Bar**: Implement dual-stacked HUD with LMB/RMB keybind hints.
- **UI: Tome of Whispers**: Implement parchment-style selector with variant detail panel.
- **VFX**: Pillar of light / Choral swells for "Pledging" actions.

### Phase 4: Content & Polish
- Configure 3 Archetypes: Dash, Shield, Fireball.
- Verify end-to-end flow.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Effect Blocks | Flexibility | Hardcoding each ability creates unmanageable tech debt. |
| Projectile Sim | Authority | Client-side projectiles are vulnerable to exploits. |

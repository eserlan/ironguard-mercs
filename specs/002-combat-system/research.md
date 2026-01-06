# Research & Decisions: Combat System (002)

**Feature**: 002-combat-system

## Design Decisions

### 1. Networking Strategy
**Decision**: Client sends Intent, Server broadcasts Outcome.
**Payload**: `CombatIntent` includes origin/direction for validation, but NOT "TargetID".
**Rationale**:
- Server performs the raycast/overlap to determine *who* was hit. Client only says "I shot *here*". Prevents aimbots from guaranteeing hits on obscured targets.

### 2. Validation Layers
**Decision**: Multi-stage Validation.
1.  **Rate Limit**: Drop packet if sending too fast.
2.  **State**: Drop if dead or stunned.
3.  **Ownership**: Drop if weapon not equipped.
4.  **Geometry**: Drop if origin is too far from server character position (anti-teleport).
**Rationale**: Fail-fast validation saves CPU on expensive raycasts.

### 3. Pure Logic Pipeline
**Decision**: Damage calculation is a pure function: `(Attacker, Defender, Weapon) => Result`.
**Rationale**:
- Deterministic.
- Unit Testable without mocking Roblox parts.
- Easy to add modifiers later (e.g., "Take 10% less damage").

### 4. Status Effects
**Decision**: Simple "Tick" system driven by `RunService.Heartbeat` (Server).
**Scope**: Burn (DOT), Slow (Stat Mod).
**Rationale**: Keep it simple for 002. Complex interaction matrices (Water douses Fire) are out of scope.

## Open Questions Resolved
- **Targeting**: Hybrid (Intent-based, Server-validated).
- **Resources**: Cooldown Only (No Mana).
- **VFX**: Optimistic local cast, Authoritative impact.

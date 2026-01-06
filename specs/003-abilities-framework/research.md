# Research & Decisions: Abilities Framework

**Feature**: 003-abilities-framework

## Architecture Decisions

### 1. Effect Block Pattern
**Decision**: Abilities are composed of ordered "Effect Blocks" (Damage, Heal, Dash, SpawnProjectile).
**Rationale**:
- **Composability**: Designers can create "Lifesteal Dash" by combining `Dash` + `Damage` + `Heal` blocks.
- **Testability**: Each block type can be unit tested in isolation (`resolveDamageBlock`, `resolveDashBlock`).

### 2. Targeting Payloads
**Decision**: Explicit payload types per targeting mode.
- **Self**: Empty.
- **Point**: `Vector3`.
- **Entity**: `TargetId`.
- **Direction**: `Origin` + `Direction`.
**Rationale**:
- Generic payloads lead to runtime errors. Typed payloads ensure the Validator knows exactly what to check (e.g., "Is Point within Range?", "Is Entity Hostile?").

### 3. Server-Side Projectiles
**Decision**: Server spawns and simulates projectiles.
**Compensation**: Client plays immediate "Cast" VFX. Server sends "Spawned" event for other clients.
**Rationale**:
- Prevents "magic bullet" cheats where clients claim hits.
- Ensures consistent state for all observers.

### 4. Integration with Combat
**Decision**: Abilities delegate damage/status logic to `CombatService`.
**Rationale**:
- Single source of truth for Health/Death. Abilities are just another "Damage Source".

## Open Questions Resolved
- **Logic**: Component-based (Effect Blocks).
- **VFX**: Optimistic Cast / Authoritative Impact.
- **Passives**: Out of Scope (Active Only).
# Abilities Framework

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-06
**Feature Branch**: `003-abilities-framework`
**Input**: "Standard for how abilities are defined, structured, executed, and synced."

## Summary

This feature defines the standard for how abilities are defined, structured, executed, and synced in IronGuard Mercs. It establishes a rigorous data model and execution pipeline to ensure abilities are consistent, testable, and performant over the network. The framework enforces a "Top/Bottom" behavior model to separate high-level logic from low-level execution.

## Problem / Why

Without a strict framework, abilities risk becoming "one-off snowflakes"—custom scripts that are hard to debug, balance, or extend. This leads to code duplication, network desyncs, and a maintenance nightmare. We need a unified system to ensure every ability behaves predictably and uses shared infrastructure for cooldowns and replication.

## Proposal / What

We will implement a data-driven framework where abilities are defined by strict schemas. The execution model follows a **Top/Bottom** approach:
*   **Top (Server)**: Authoritative state, validation, cooldowns, damage application.
*   **Bottom (Client)**: Input capture, visual prediction, feedback display.

### User Scenarios & Testing

#### User Story 1 - Define Standard Ability (Priority: P1)
**Description**: A developer creates an ability using the standard data schema (e.g., `Fireball` with `Damage=50`, `Cooldown=5`).
**Value**: Enforces consistency.
**Independent Test**: Create a new data module. Run a validator script to confirm it adheres to the schema (no missing fields).

#### User Story 2 - Top/Bottom Execution (Priority: P1)
**Description**: Player activates an ability. Client predicts the visual (Bottom); Server validates and applies damage (Top).
**Value**: Ensures responsiveness (prediction) while maintaining security (server authority).
**Independent Test**: Simulate 200ms lag. Trigger ability. Verify visual starts immediately. Verify damage applies ~200ms later.

#### User Story 3 - Cooldown Sync (Priority: P2)
**Description**: Cooldowns are tracked on the server and replicated to the client.
**Value**: Prevents cheating and desync.
**Independent Test**: Fire ability. Verify server timestamp. Try to fire again immediately from client (should be rejected).

### Requirements

#### Functional
- **FR-001**: System MUST strictly separate Ability Data (Properties) from Execution Logic (Scripts).
- **FR-002**: System MUST implement **Server Authority** for all state changes (Damage, Cooldowns).
- **FR-003**: System MUST support **Client Prediction** for visuals and movement.
- **FR-004**: System MUST use a standardized networking protocol for ability events (e.g., `FireAbility(id, target)`).
- **FR-005**: All abilities MUST adhere to a strict Data Model (Schema).
- **FR-006**: Logic MUST be composed of reusable **Components** (Damage, Dash, Shield) for >90% of abilities.
- **FR-007**: VFX MUST follow an **Optimistic** pattern: Cast visuals are immediate/predicted, Impact visuals are authoritative.
- **FR-008**: System MUST focus strictly on **Active Abilities**; Passives/Stats are handled externally.

#### Key Entities
- **AbilityData**: The static definition (ModuleScript).
- **AbilityState**: Runtime data (Cooldowns, Active Effects).
- **Executor**: The logic handler (Top/Bottom pair).

### Edge Cases
- Client fires ability, but packet is lost (Server never receives).
- Server validates ability, but client has disconnected.
- "Rubber-banding" if movement abilities are predicted incorrectly.

## Technical / How

**Platform**: Roblox (Luau).
We will use a centralized `AbilityService` (Server) and `AbilityController` (Client). Data definitions will be strictly typed. Networking will use `RemoteEvents` with rigorous input validation.

**Logic Architecture (Hybrid Strategy)**:
1.  **Standard Components**: 90-95% of abilities MUST use reusable components (Damage, Dash, Status, Shield) wired via data.
2.  **Exception Rule**: Custom logic is ONLY allowed for "Ultimate" abilities or unique mechanics that cannot be composed.
    *   Must live in a dedicated `CustomEffects` module (not inline).
    *   Must be explicitly referenced by ID in the data model.
    *   Must include dedicated tests.

**VFX Strategy (Optimistic)**:
*   **Client (Immediate)**: Plays cast animations, wind-ups, self-FX (glows, trails) based on local input + data. This is cosmetic and implies intent, not success.
*   **Server (Authoritative)**: Validates cast, computes hits, and broadcasts "Impact" events.
*   **Impact FX**: Hit flashes, AoE explosions, damage numbers, and status visuals are ONLY played when the server confirms the event.

**System Boundaries (Active Only)**:
The Abilities Framework is strictly for "things you press" (TOP/BOTTOM behaviors). Passive traits (e.g., +10% Armor, conditional modifiers) are handled by a separate **Stats/Passives System**.
*   **Rationale**: Separating lifecycle (active execution vs. persistent evaluation) avoids system overload and makes the Stats system more robust for gear/buffs/progression.
*   **Integration**: The Abilities Framework can emit effects to the Stats system (e.g., "Apply +10% Armor for 8s"), but the evaluation logic lives in the Stats system.

## Risks
- **Prediction Desync**: Visuals claiming a hit when the server denies it. Mitigation: Clear feedback for "Miss/Deny".
- **Complexity**: The Top/Bottom split requires writing two sets of logic for complex skills. Mitigation: Shared libraries for common math/geometry.

## Open Questions
- **Q1: Custom Logic Strategy**: Resolved (Hybrid).
- **Q2: VFX Handling**: Resolved (Optimistic).
- **Q3: Passives Integration**: Resolved (Active Only).

## Success Criteria
- **SC-001**: New abilities can be added using ONLY data configuration (for simple types).
- **SC-002**: Visuals trigger instantly (0ms latency) on client input.
- **SC-003**: Server rejects 100% of invalid cooldown attempts.
- **SC-004**: "Snowflake" code is reduced to <10% of total ability codebase.
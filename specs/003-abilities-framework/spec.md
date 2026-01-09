# Abilities Framework

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-06
**Feature Branch**: `003-abilities-framework`
**Input**: "Standard for how abilities are defined, structured, executed, and synced."

## Summary

This feature defines the standard for how **Sacred Actions** (Abilities) are defined, structured, executed, and synced in the Sanctuary of Valor. It establishes a rigorous data model and execution pipeline to ensure every hero's skills are consistent, testable, and performant. The framework enforces a **Top/Bottom Variant** approach, presented diegetically via the **Tome of Whispers** and the **Sacred Bar**, separating heavenly server-side logic from earthly client-side execution.

## Problem / Why

Without a strict framework, abilities risk becoming "one-off snowflakes"—custom scripts that are hard to debug, balance, or extend. This leads to code duplication, network desyncs, and a maintenance nightmare. We need a unified system to ensure every ability behaves predictably and uses shared infrastructure for cooldowns and replication.

## Proposal / What

We will implement a data-driven framework where abilities are defined by strict schemas. The execution and interaction model follows a **Top/Bottom Variant** approach, presented through a diegetic high-fantasy lens:
*   **Top (Heavenly/Authoritative)**: Authoritative state, validation, cooldowns. Executed via Primary Input (LMB/1).
*   **Bottom (Earthy/Tactical)**: Visual prediction, quick feedback. Executed via Secondary Input (RMB/Shift).

### The Tome of Whispers (Selection)
Abilities are not "equipped" in menus; they are **Pledged** at the Tome of Whispers. The selection UI uses a parchment aesthetic with a detailed "Prophecy" panel showing variant names, technical lore, and cooldowns.

### The Sacred Bar (HUD)
The gameplay HUD features a **Dual-Stacked** layout for each slot:
- One slot contains two distinct buttons (Top/Bottom).
- Keybind hints are integrated diegetically (e.g., "[LMB] Top").
- Cooldowns are visualized via a vertical red "eclipse" fill, synchronized via high-resolution client clock (Heartbeat).

### User Scenarios & Testing

#### User Story 2 - Top/Bottom Execution (Priority: P1)
**Description**: Player activates an ability. Client triggers the **Bottom** action for immediate visual prediction; Server validates and triggers the **Top** action for authoritative resolution.
**Value**: Enables asymmetric behavior where clients can predict visuals/movement while the server enforces actual state changes.

#### User Story 4 - Slot-Based Loadouts (Priority: P1)
**Description**: Abilities are executed via assigned slots (1-4) on a character's loadout.
**Value**: Integrates combat mechanics with class progression.

### Requirements

#### Functional
- **FR-001**: System MUST strictly separate Ability Data (Properties) from Execution Logic (Scripts).
- **FR-002**: System MUST implement **Server Authority** for all state changes (Damage, Cooldowns).
- **FR-003**: System MUST support **Top/Bottom Variant** configuration allowing asymmetric parameters.
- **FR-004**: System MUST use a standardized networking protocol for ability intents.
- **FR-005**: The HUD MUST display 4 slots, each supporting dual-stacked interaction for variant execution.
- **FR-006**: Ability selection MUST occur via the diegetic "Tome of Whispers" interface.

#### Key Entities
- **AbilityConfig**: Static definition containing `top` and `bottom` variants.
- **EffectBlock**: Atomic logic units typed via `EffectType` (Damage, Heal, Dash, Shield, Projectile, Status).
- **AbilityIntent**: Network payload containing `slotIndex`, `action` (Top/Bottom), and targeting data.

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

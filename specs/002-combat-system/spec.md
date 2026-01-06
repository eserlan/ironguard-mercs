# Real-Time Combat System

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-06
**Feature Branch**: `002-combat-system`
**Input**: "Defines how real-time combat works, including abilities, cooldowns, damage, survivability, and pacing."

## Summary

This feature defines the real-time combat mechanics for IronGuard Mercs. It shifts the focus from turn-based tactics to active engagement, governing how abilities are used, how cooldowns manage pacing, and how movement interacts with combat. It establishes the "twitch" gameplay loop where timing and positioning are immediate.

## Problem / Why

We need to lock down how every class and enemy actually fights. Without a defined cooldown economy and movement rule set, combat will devolve into button-mashing or static stat-checking. We need a system that rewards skill and manages the flow of battle.

## Proposal / What

Combat is **Real-Time**. Players control a single unit directly. Pacing is managed strictly via **Cooldowns** (no Mana/Energy).

### User Scenarios & Testing

#### User Story 1 - Ability Usage (Priority: P1)
**Description**: Player activates an ability. It fires immediately if off cooldown. Targeting uses a **Hybrid/Soft-Lock** system (attacks hit what is in front, but can lock-on for focus).
**Value**: Core interaction for combat. "Souls-like" targeting ensures combat feels weighty and intentional.
**Independent Test**: Press Key -> Verify Ability Effect -> Verify Cooldown Start -> Press Key again (Fail).

#### User Story 2 - Movement & Evasion (Priority: P1)
**Description**: Player moves freely while attacking. Some abilities may lock movement.
**Value**: "Kiting" and dodging are essential survivability tools in real-time combat.
**Independent Test**: Move while firing basic attack. Move while casting "heavy" ability (verify slow/lock).

### Requirements

#### Functional
- **FR-001**: System MUST process combat inputs in real-time (no turns).
- **FR-002**: Abilities MUST have individual Cooldown timers.
- **FR-003**: System MUST NOT use Mana/Energy; Cooldowns are the sole limiting factor.
- **FR-004**: System MUST implement **Hybrid/Soft-Lock** targeting:
  - Default: Hits targets in a cone/box in front of the unit.
  - Optional: Can "lock-on" to a single target to maintain focus.

#### Key Entities
- **Ability**: Properties: `Damage`, `Cooldown`, `CastTime`.
- **UnitState**: `IsCasting`, `CanMove`, `Health`, `LockOnTarget`.

### Edge Cases
- Casting an ability right as the unit dies.
- Network latency causing "rubber-banding" during movement abilities.

## Technical / How

**Platform**: Roblox (Luau).
We will use Roblox's `ContextActionService` for input. Abilities will be managed by a `CooldownService`. Server-side validation is critical. Targeting will use Raycasts and `GetPartBoundsInBox` for hit detection.

## Risks
- **Network Lag**: Real-time combat on Roblox can be laggy. Mitigation: Client-side prediction for visuals, Server-side authority for damage.
- **Pacing**: Cooldowns too short = spam. Mitigation: Tuning the "Global Cooldown" and ability cast times.

## Open Questions
- **Q1: Targeting System**: Resolved (Hybrid/Soft-Lock).
- **Q2: Resource System**: Resolved (Cooldown Only).

## Success Criteria
- **SC-001**: Ability fires immediately on input (client visual).
- **SC-002**: Cooldown prevents re-firing within X seconds.
- **SC-003**: Movement is smooth and responsive during combat.
- **SC-004**: Hits are correctly registered on targets within the forward cone/box.
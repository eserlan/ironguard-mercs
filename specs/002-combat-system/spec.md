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
**Description**: Player activates an ability. It fires immediately if off cooldown. Targeting uses **Real-Time Physics** (Raycasts for hitscan, OverlapParams for melee/AOE).
**Value**: Core interaction for combat. Precise physics-based targeting ensures skill matters.
**Independent Test**: Press Key -> Verify Ability Effect -> Verify Cooldown Start -> Press Key again (Fail).

#### User Story 2 - Combat Synergy (Priority: P1)
**Description**: Certain conditions (flanking, comboing, team-up) trigger **Synergy**. This applies a multiplicative bonus to the base damage.
**Value**: Encourages team-play and tactical positioning.
**Independent Test**: Attack target with Synergy active -> Verify damage matches `(Base + Weapon) * (1 + SynergyMultiplier)`.

### Requirements

#### Functional
- **FR-001**: System MUST process combat inputs in real-time.
- **FR-002**: Abilities MUST have individual Cooldown timers.
- **FR-003**: System MUST NOT use Mana/Energy; Cooldowns are the primary limiting factor.
- **FR-004**: System MUST implement **Physics-Based Targeting**.
- **FR-005**: Combat MUST support **Synergy Multipliers** for cooperative or tactical advantages.

#### Key Entities
- **CombatStats**: `baseDamage`, `synergyMultiplier`, `critChance`, `critMultiplier`.
- **DamageResult**: `amount`, `isCrit`, `targetId`, `isFatal`.
- **Ability**: Properties: `Damage`, `Cooldown`, `CastTime`, `TargetType`.

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
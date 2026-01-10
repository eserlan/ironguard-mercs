# Player Classes (Core Concept)

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-06
**Feature Branch**: `005-player-classes`
**Input**: Feature description for Player Classes, Shield Saint, and Ashblade.

## Summary

Player Classes define a character’s combat role, ability library, and gameplay identity. They determine how a player contributes to the team through distinct mechanics, pacing, and decision-making styles. This feature establishes the base class system and introduces two starter classes: **Shield Saint** (Protector) and **Ashblade** (Striker).

### The Shield Saint: Anchor of the Sanctuary
A majestic mountain-top cathedral warrior. The Shield Saint is the wall between the darkness and the weak. Their abilities focus on **Pledging Protection**, **Sacred Mitigation**, and **Spiritual Attunement**.

- **Theme**: Ivory stone, gold filigree, pillars of light, deep choral swells.
- **Role**: Protector / Anchor.
- **Weapon**: Heavy Greatshield and Mace.

### The Ashblade: Shadow of the Cinder
The mountain’s fleeting heat. The Ashblade moves like smoke and strikes like a sudden wildfire. Their abilities focus on **High Mobility**, **Precision Status**, and **Momentum-based Execution**.

- **Theme**: Black ash, glowing embers, wisps of grey smoke, sharp metallic whispers.
- **Role**: Striker / Duelist.
- **Weapon**: Dual Twin-Blades of Cinder-Steel.

## Problem / Why

Without distinct classes, player roles are ambiguous and team synergy is hard to achieve. We need a system that allows for specialized gameplay styles to ensure replayability and tactical depth. The "Shield Saint" and "Ashblade" establishment provides the core contrast (Anchor vs. Duelist) needed to validate the combat system's flexibility.

## Proposal / What

Each class provides a curated library of active abilities. Players equip a limited loadout for each run. Abilities follow a **TOP/BOTTOM action model**:
- **TOP Actions**: Impactful, longer cooldowns (usually offensive or major defensive).
- **BOTTOM Actions**: Utility, mobility, or light defensive effects with shorter cooldowns.
- Using either action triggers a shared cooldown for that slot.

### User Scenarios & Testing

#### User Story 1 - Shield Saint: Protector Role (Priority: P1)
**Description**: As a Shield Saint, I want to use my shield to absorb damage for an ally in danger.
**Value**: Core "Anchor" fantasy; prevents team wipes.
**Independent Test**: Use a "Shield" ability near a low-HP ally. Verify damage is redirected or mitigated.
**Acceptance Scenarios**:
1. **Given** an ally is taking damage, **When** Shield Saint activates a Protection TOP action, **Then** the ally receives a temporary shield or damage reduction.

#### User Story 2 - Ashblade: Agile Striker (Priority: P1)
**Description**: As an Ashblade, I want to dash through an enemy and strike them from behind for burst damage.
**Value**: Core "Duelist" fantasy; high skill expression.
**Independent Test**: Use a "Dash Strike" ability. Verify movement through target and damage application.
**Acceptance Scenarios**:
1. **Given** an enemy opening, **When** Ashblade activates a Momentum TOP action, **Then** the Ashblade dashes and deals high damage if the timing is precise.

#### User Story 3 - TOP/BOTTOM Decision Making (Priority: P2)
**Description**: A player chooses between a powerful TOP action and a quick BOTTOM utility based on the current combat heat.
**Value**: Adds tactical pacing and decision depth.
**Independent Test**: Activate a BOTTOM utility (e.g., quick slip). Verify short cooldown. Activate TOP action. Verify longer cooldown.
**Acceptance Scenarios**:
1. **Given** an ability slot, **When** the player triggers the BOTTOM action, **Then** the ability enters a 3s cooldown. **When** the player triggers the TOP action, **Then** it enters a 10s cooldown.

### Requirements

#### Functional
- **FR-001**: System MUST support a registry of Player Classes.
- **FR-002**: Each Class MUST have a unique set of available Abilities.
- **FR-003**: Abilities MUST support the TOP/BOTTOM action model (two intents per ability ID).
- **FR-004**: System MUST enforce shared cooldowns between TOP and BOTTOM actions of the same ability.
- **FR-005**: Shield Saint abilities MUST emphasize damage mitigation and soft-taunt (target bias).
- **FR-006**: Ashblade abilities MUST emphasize mobility and burst damage.
- **FR-007**: Players MUST be able to equip up to **4 active ability slots** in their loadout.

#### Key Entities
- **PlayerClass**: Defines the archetype and ability pool.
- **ClassAbility**: A specific ability slot with TOP and BOTTOM definitions.
- **Loadout**: The selection of 4 abilities equipped by the player for a run.

### Edge Cases
- Using an ability while already on cooldown (should be rejected).
- Switching classes mid-run (Non-goal: Classes are locked at match start).
- Multiple Shield Saints stacking defensive buffs (Diminishing returns or non-stacking rules needed).

## Technical / How

**Platform**: Roblox (roblox-ts / Flamework).
This system builds on the **Abilities Framework (003)**. The `AbilityIntent` includes an `ActionSlot` (Top or Bottom). 
- **Input Mapping**: By default, players use `1, 2, 3, 4` keys for abilities.
- **Shift Modifier**: Holding `Shift` + `SlotKey` triggers the **TOP** action; pressing the `SlotKey` alone triggers the **BOTTOM** action.

## Risks

- **Balance**: Ashblade might feel too squishy or Shield Saint too slow. Mitigation: Heavy use of "Tuning Knobs" in config.
- **Complexity**: Players might find choosing between TOP/BOTTOM in real-time overwhelming. Mitigation: Clear UI indicators showing both halves of the ability card.

## Open Questions

- **Q1: Loadout Size**: Resolved (4 active slots).
- **Q2: Action Bindings**: Resolved (Shift modifier).
- **Q3: Multi-Classing**: Can a player take abilities from different classes? (Default: No, classes are strict buckets).

## Success Criteria

- **SC-001**: A player can select a class in the lobby and have their ability set updated.
- **SC-002**: An ability correctly triggers a long cooldown for a TOP action and a short one for a BOTTOM action.
- **SC-003**: Ashblade can successfully kill a "Grunt" enemy in under 5 seconds using momentum.
- **SC-004**: Shield Saint can keep an ally at >20% HP for 10 seconds while they are targeted by 3 Grunt Archers (10 DPS each).

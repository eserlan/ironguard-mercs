# Core Gameplay & Vision

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-06
**Feature Branch**: `001-core-gameplay`
**Input**: "Defines the overall player experience, design pillars, and constraints of the game."

## Summary

This specification defines the overall player experience, design pillars, and constraints of IronGuard Mercs. It establishes the "North Star" for development, ensuring all mechanics align with the core fantasy of commanding a mercenary squad. It details the primary Gameplay Loop and the tactical standards for the MVP.

## Problem / Why

To ensure everyone knows what game we are actually building. Without a clear vision and defined non-goals, the project risks feature creep, tonal inconsistency, and wasted engineering effort on mechanics that don't serve the core experience.

## Proposal / What

### Vision
Command a squad of elite mercenaries in high-stakes tactical operations where profit is the only loyalty.

### Design Pillars
1.  **Tactical Consequence**: Every move matters. Cover, positioning, and turn order determine survival. Mistakes are punished; strategy is rewarded.
2.  **Mercenary Management**: Units are assets, not just stats. They have costs, loadouts, and permadeath risks.
3.  **Clean Mechanics**: Complexity comes from unit interactions and map design, not convoluted UI or obscure rules.

### Core Gameplay Loop
1.  **Preparation**: Select units and loadouts based on mission intel.
2.  **Deployment**: Place units on the tactical grid.
3.  **Tactical Combat**: Turn-based movement and attacks (Player Phase / Enemy Phase).
4.  **Resolution**: Mission success/failure, loot acquisition, unit experience.
5.  **Upkeep**: Heal wounds, replace losses, buy gear.

### User Scenarios (Tactical Slice)

#### User Story 1 - Unit Movement (Priority: P1)
**Description**: A player selects a unit and moves it to a valid tile to flank an enemy or seek cover.
**Value**: Fundamental interaction for the "Tactical Consequence" pillar.
**Independent Test**: Select unit -> Highlight Range -> Click Destination -> Verify Position.

#### User Story 2 - Basic Combat (Priority: P1)
**Description**: A unit attacks a target. Damage is calculated by `Base Attack + Drawn Modifier`.
**Value**: The primary means of resolving conflict. "Gloomhaven-ish" randomness ensures tension without chaos.
**Independent Test**: Attack Enemy -> Draw Modifier (+1) -> Verify Damage = (Base + 1) -> Verify Enemy HP.

### Requirements

#### Functional
- **FR-001**: System MUST support a **SQUARE** grid for tactical positioning.
- **FR-002**: System MUST enforce turn-based phases (Player -> Enemy).
- **FR-003**: System MUST track unit persistent state (Alive/Dead/HP).
- **FR-004**: Combat MUST use a **Modifier Deck** system (not dice).
  - Attack = Base Stat + Modifier Card (e.g., +0, +1, -1, x2, Null).
  - Decks reset/shuffle according to specific rules (e.g., after x2/Null).

#### Key Entities
- **Squad**: Collection of available units.
- **Mission**: A defined map with objectives and enemies.
- **GridMap**: The tactical playspace (Square).
- **ModifierDeck**: A collection of modifier values drawn during combat.

### Non-Goals
- **No Open World**: Gameplay is strictly mission-based.
- **No Real-Time Elements**: All action is turn-based.
- **No Hero Units**: Individual units are expendable; the *Squad* is the hero.

## Technical / How

**Platform**: Roblox (Luau).
The game runs on a central `GameLoop` controlling the state machine (`PrepState` -> `TacticalState` -> `ResultState`). The grid system uses 2D arrays or coordinate hashing for the Square grid. Combat logic pulls from a `ModifierService` that manages decks for players and enemies.

## Risks
- **Scope Creep**: Adding too many stats/abilities early. Mitigation: Stick to Move + Attack for MVP.
- **Fun Factor**: Turn-based can feel slow on Roblox. Mitigation: Keep animations snappy and enemy turns fast.

## Open Questions
- **Q1: Grid Type**: Resolved (Square).
- **Q2: Combat Determinism**: Resolved (Gloomhaven-style Modifier Deck).

## Success Criteria
- **SC-001**: Complete a full loop: Deploy -> Move -> Kill Enemy -> End Mission.
- **SC-002**: "Tactical Consequence" felt via losing a unit in a bad position (qualitative).
- **SC-003**: Combat results reflect the modifier card drawn (e.g., 5 dmg + 1 card = 6 total).
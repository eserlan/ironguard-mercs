# Core Gameplay & Vision (Real-Time)

**Status**: Approved
**Owner**: Gemini Agent
**Created**: 2026-01-06 (Updated: 2026-01-07)
**Feature Branch**: `001-core-gameplay`
**Input**: Real-Time Session-Based Action Loop.

## Summary

IronGuard Mercs is a replayable, session-based action game where players command a squad of mercenaries in high-stakes, real-time tactical operations. The core experience centers on deterministic, seeded "runs"—from lobby preparation through intense combat in procedural environments to successful extraction and persistent progression.

## Problem / Why

We need a unified vision that balances skill-based action with tactical depth. A deterministic, seeded loop ensures that success is repeatable and "fair," while the session-based structure allows for rapid iteration and high replayability. This document serves as the authoritative definition of the "North Star" for all sub-systems (Combat, ProcGen, Progression).

## Proposal / What

### Vision
Assemble a crew of specialized mercenaries for high-stakes, real-time tactical co-op operations. Each player controls a single mercenary from a First-Person or Third-Person perspective (FPV/TPV), working together to survive and profit.

### Design Pillars
1.  **Tactical Real-Time**: Combat is fast and lethal. Positioning (flanking, height, cover) matters as much as timing.
2.  **Mercenary Economy**: Consequence drives depth. Mercenaries are assets to be maintained, risking permadeath for high rewards.
3.  **Co-op Synergy (One Merc per Player)**: Designed for 1-4 players. Each participant selects one mercenary from their personal roster to deploy. Success comes from combining these unique tools.

### Core Gameplay Loop
1.  **Preparation (Meta)**: Each player selects *one* mercenary from their persistent roster, equips gear, and pays upkeep.
2.  **Deployment**: Players group up in the Lobby and launch into a procedural mission instance.
3.  **Active Engagement**: Players control their individual unit in real-time combat, completing objectives as a squad.
4.  **Extraction/Resolution**: Survive the mission to claim loot and XP. Run results are applied to the persistent roster according to the Mission Mode.
5.  **Recovery (Meta)**: In the Lobby, players heal wounded mercenaries, hire replacements for fallen ones, and manage gear.

### Mission Modes
Missions are played in one of two distinct modes. A single mission instance cannot mix players from different modes.
- **Standard Mode**: Casual play. Mercenaries do not suffer permadeath. Failing a mission might result in temporary wounds or equipment loss, but the unit remains in the roster.
- **Ironman Mode (Permadeath)**: High-stakes play.
    - **Lethality**: If a mercenary is killed, they are permanently removed from the roster.
    - **Rewards**: 50% Higher Gold and XP gains compared to Standard Mode.
    - **Matchmaking**: Players only play with others who have selected Ironman Mode.

### Mercenary Management
The squad is the persistent heart of the game.
- **Roster Capacity**: Players maintain a list of available mercenaries.
- **Wounds & Recovery**: Units taken to low health may require "Rest" in the lobby before being deployable again.
- **Permadeath**: Exclusive to **Ironman Mode**. If a mercenary is killed in an Ironman mission, they are permanently removed from the roster. Their legendary gear may be salvageable, but their XP and base stats are lost.
- **Upkeep**: Higher-level mercenaries require more "Gold" per mission. Failure to pay upkeep might lead to desertion or reduced performance.

### User Scenarios & Testing

#### User Story 1 - Mission Participation (Priority: P1)
**Description**: A player selects a character and joins a mission. They control their unit using standard Roblox movement and camera controls (FPV/TPV), moving freely and interacting with the environment.
**Value**: Core gameplay entry point and immersiveness.
**Independent Test**: Join Room -> Spawn -> Move Unit -> Scroll Camera -> Trigger Objective.

#### User Story 2 - Squad Coordination (Priority: P1)
**Description**: Multiple players combine abilities to defeat a boss or clear an objective in real-time.
**Value**: Validates the co-op synergy and class distinctness.
**Independent Test**: Two players use abilities on a single target. Verify damage stacking or synergy triggers.

### Mission Lifecycle
1.  **Contract Selection**: Players choose a mission from a daily rotating list in the Lobby.
2.  **Briefing**: Seeded generation results in a mission-specific plan (Layout, Objectives).
3.  **Infiltration**: Players spawn at the extraction point or entrance.
4.  **Climax**: The primary objective (e.g., Clear Arena, Extract Data).
5.  **Extraction**: Players must reach a designated point to end the mission and bank rewards.

### Requirements

#### Functional
- **FR-001**: System MUST support real-time unit movement and ability execution (One unit per player).
- **FR-006**: System MUST utilize standard Roblox camera and character controls (allowing FPV and TPV via scrolling).
- **FR-002**: System MUST manage a persistent Squad roster (per player) with optional permadeath support.
- **FR-007**: System MUST enforce mode separation (Standard vs. Ironman) during matchmaking/lobby formation.
- **FR-008**: System MUST apply reward multipliers for Ironman mode missions.
- **FR-005**: System MUST prevent a single player from controlling multiple mercenaries simultaneously in a mission.
- **FR-003**: System MUST support a Mission State Machine (Lobby -> Run -> Results).
- **FR-004**: Combat mechanics (RNG, damage, cooldowns) are defined in **Spec 002**.

#### Key Entities
- **RunConfig**: The data container for Seed, Mode, and Difficulty.
- **MatchState**: The reactive state of the current session.
- **WorldPlan**: The pure-logic layout produced by the generator.
- **Combatant**: The authoritative wrapper for Players and Enemies.

## Technical / How

**Platform**: Roblox (roblox-ts / Flamework).
The game architecture is split into **Pure Shared Logic** (Algorithms) and **Authoritative Server Services**.
- **Logic**: RNG, FSM transitions, and XP curves are pure TS modules tested via Vitest.
- **Networking**: Reactive state sync via Flamework or custom observers.
- **Physics**: Server-side hit detection (Raycast/Overlap) validates all player intents.
- **Movement**: Standard Roblox Character physics with server-side validation.

## Risks
- **Networking Lag**: Real-time action requires low-latency feel. Mitigation: Optimistic client prediction for casts/movement.
- **Complexity**: Balancing 4p co-op can be difficult. Mitigation: Shared Team Level and capped stat nudges.

## Success Criteria
- **SC-001**: Mission start to extraction loop verified end-to-end.
- **SC-002**: 100% of core algorithms (RNG, State, Roster Management) verified by unit tests.
- **SC-003**: Roster persistence (including Permadeath) correctly handles mission resolution.
- **SC-004**: Standard and Ironman players successfully isolated in matchmaking.

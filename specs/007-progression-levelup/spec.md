# Progression & Level Up (Core Concept)

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-06
**Feature Branch**: `007-progression-levelup`
**Input**: Progression defines how players gain power and options over time. Levelling up grants predictable, readable upgrades and meaningful choices.

## Summary

This feature defines the progression architecture for IronGuard Mercs, covering both in-run power growth and persistent account-wide unlocks. It establishes the "Level Up" loop where players earn XP from combat and objectives, triggering choice-driven rewards that deepen build identity without compromising co-op balance.

## Problem / Why

Without a structured progression system, gameplay can feel stagnant and lacks a sense of long-term achievement. We need a system that rewards skill and investment, provides variety across different runs, and ensures players have a clear path to mastery. This concept prevents power gaps from becoming insurmountable while ensuring every run feels impactful.

## Proposal / What

We will implement a **Hybrid Progression Model** that strictly separates persistent breadth (options) from session-based depth (power).

### 1. Run Progression = Power
**Applies only within a run, resets afterward.**
*   **Rewards**: Ability augments, temporary modifiers, and traits that change moment-to-moment play.
*   **Stat Nudges**: Small, capped nudges (e.g., minor cooldown reduction).
*   **Intent**: Power ramps *within* the run; success is about adapting your build to the current run's challenges.

### 2. Meta Progression = Options
**Persistent across runs, but grants no raw power.**
*   **Unlocks**: New classes, new abilities added to class libraries, new augment/trait pools, and cosmetics.
*   **Starting Options**: Sideboard size, starting pick choices, and profile flair.
*   **Explicit Exclusions**: No flat damage/HP scaling, permanent cooldown reduction, or CC duration boosts.

### 3. Co-op Fairness & Guardrails
*   **Ceiling vs. Breadth**: Veterans have more choices and flexibility, but new players are never numerically underpowered.
*   **Horizontal Unlocks**: Meta unlocks must always be horizontal (new ways to play) rather than vertical (stronger versions of existing play).
*   **Static Difficulty**: Match difficulty is balanced against the baseline power floor, not the squad's average meta level.
*   **Hard Caps**: Run-based power must obey global hard caps to prevent broken builds.

### 4. Team Power Level & XP Sharing
To prevent power gaps while preserving player agency, we use a shared **Team Power Level** combined with individual choice tracks.
*   **Shared XP Bar**: The squad shares a single XP bar that determines the current Run Level.
*   **Simultaneous Events**: When the team levels up, ALL players receive a level-up event and selection screen simultaneously.
*   **Independent Choices**: Each player makes their own independent reward choice from the same power band, ensuring build variety without level gaps.
*   **Safeguards**:
    *   XP is primarily earned from team actions (objectives, clears, elites).
    *   Late-joining or revived players immediately sync to the current Team Level.
    *   Boss phases queue level-ups to prevent mid-fight distractions.

### Level-Up Rewards (Buckets)
1.  **Ability Unlocks**: New skills added to the class library.
2.  **Loadout Capacity**: Extra slots or sideboard options.
3.  **Ability Augments**: Choose 1 of 3 modifiers for a specific ability.
4.  **Traits / Passives**: Build-shaping perks (e.g., "Blocking grants brief haste").
5.  **Resource/Utility**: Extra items or charge capacity.
6.  **Stat Nudges**: Small, capped improvements (HP, Cooldown).

### User Scenarios & Testing

#### User Story 1 - Choosing a Run Perk (Priority: P1)
**Description**: During a run, I cross an XP threshold. A selection screen appears offering me 3 distinct perks. I choose one that complements my current loadout.
**Value**: Core loop for build variety and immediate gratification.
**Independent Test**: Trigger a level-up event. Verify UI shows 3 random but valid options. Select one and verify the stat/behavior change is applied immediately.
**Acceptance Scenarios**:
1. **Given** a player is at Level 1, **When** they earn sufficient XP, **Then** a "Level Up" event triggers and the UI presents 3 choices.

#### User Story 2 - XP from Team Objectives (Priority: P2)
**Description**: My team completes a room objective. We all receive a significant burst of XP simultaneously, contributing to our team level or individual thresholds.
**Value**: Rewards coordination and ensures no player is left behind.
**Independent Test**: Complete a "Room Clear" objective. Verify XP is granted to all participating players.
**Acceptance Scenarios**:
1. **Given** a Room Objective is active, **When** the objective is completed, **Then** 500 XP is awarded to every player in the squad.

#### User Story 3 - Meta Unlock (Priority: P2)
**Description**: After finishing a run, I see my account XP increase. I reach a new meta-level, unlocking the "Ashblade" class for my next run.
**Value**: Long-term retention and content gating.
**Independent Test**: Complete a run with 1000 total XP earned. Verify meta-level increments and the "Ashblade" becomes selectable in the lobby.

### Level-Up Choice UX (Pacing & Flow)

Level-up choices follow a tiered approach to balance meaningful decision-making with co-op combat rhythm.

1.  **Default: Safe Rooms / Intermissions**:
    *   All level-up choices are guaranteed in Safe Rooms (between rooms/waves).
    *   Full pause is allowed; encourages discussion and build planning.
    *   Used for major choices: New abilities, traits, and loadout changes.
2.  **Emergency: Mid-Run Level-Ups (Micro Slow)**:
    *   If a level-up occurs during active combat (non-boss), the squad enters **Micro Slow** (~70–80% time slow).
    *   The player has **8–10 seconds** to choose.
    *   Only one player can trigger Micro Slow at a time; no chain-slowing.
    *   **Boss Phase Override**: Mid-combat level-ups are disabled/queued during boss phases.
3.  **Auto-Pick Rules (Timeout)**:
    *   If the timer expires, the system selects a **Safe Auto-Pick** (Defensive or Utility option).
    *   System avoids build-breaking or high-complexity options.

#### Choice UX Tier Summary
| Context | Behaviour |
|---------|-----------|
| **Safe Room** | Full pause, unlimited choice time. |
| **Combat (normal)** | Micro Slow (70–80%), short 8-10s timer. |
| **Boss Phases** | Choices queued to next safe window, no slow. |
| **Timeout** | Safe auto-pick (utility/defence). |

> **Level-up choices occur in safe rooms by default; mid-combat level-ups trigger a brief squad-wide micro-slow with a short timer and safe auto-pick to preserve co-op flow without hard pauses.**

### Requirements

#### Functional
- **FR-001**: System MUST support a **Hybrid Progression Model** (Run-based vs Meta-based).
- **FR-002**: System MUST track XP from multiple sources: Kills, Objectives, Room Clears, and Bonuses.
- **FR-003**: Level-up events MUST follow the **Tiered Co-op Pacing** rules (Safe Rooms vs. Micro Slow).
- **FR-004**: System MUST enforce **Hard Caps** on stat nudges (e.g., Cooldown Reduction cannot exceed 40%).
- **FR-005**: System MUST implement **Catch-up / Shared XP** to keep the squad at comparable power levels.
- **FR-006**: Level-up choices MUST be categorized by rarity and type.

#### Key Entities
- **ProgressionManager**: Orchestrates XP calculation and threshold checks.
- **RewardBucket**: Definition of potential upgrades (Augments, Traits).
- **RunState**: Tracks current level and active perks for the session.
- **PlayerProfile**: Persistent store for meta-level and unlocks.

### Edge Cases
- Player levels up in the middle of an intense boss fight.
- Player disconnects and reconnects (Run level must be restored).
- Reaching the absolute cap of all available upgrades in a run.

## Technical / How

**Platform**: Roblox (roblox-ts / Flamework).
Building on the **Shared Domain (001)** and **DataStore (001)** foundations.
- **XP Stream**: Use `typescript-rx` to pipe XP events from `CombatService` and `MatchService` to the `ProgressionService`.
- **Choice UI**: Implement a "Safe Room" or "Pause" mechanism.
- **Persistence**: Save Meta-XP to the `DataService` upon run completion.

## Risks

- **Snowballing**: One player becoming too powerful and "soloing" the game. Mitigation: Shared XP pool and diminishing returns on early-level farming.
- **UI Interruption**: Choosing perks during combat. Mitigation: Handled by Micro Slow and Auto-Pick rules.

## Open Questions

- **Q1: Co-op Pacing**: Resolved (Tiered Pacing: Safe Rooms + Micro Slow).
- **Q2: Progression Model**: Resolved (Hybrid: Run = Power, Meta = Options).
- **Q3: Catch-up Logic**: Resolved (Team Power Level with Individual Choice Tracks).

## Success Criteria

- **SC-001**: A player can reach Level 5 in a 10-minute run and feel a distinct difference in their "build".
- **SC-002**: Re-running the same seed results in the same sequence of XP gains and level-up choices.
- **SC-003**: A player 2 levels behind the leader receives +25% bonus XP until they catch up (if using rubberbanding).
- **SC-004**: Level-up UI interaction takes < 5 seconds for experienced players.

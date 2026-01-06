# Monsters & Opponents (Core Concept)

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-06
**Feature Branch**: `006-monster-concept`
**Input**: Monsters and Opponents are the primary enemies in a run, defined by readable roles, telegraphed attacks, and counterplay that rewards teamwork, positioning, and cooldown timing.

## Summary

Monsters and Opponents are authored enemies with clear combat identities (e.g., bruiser, artillery, controller) and a kit of actions they use in real time. They are designed for co-op readability and moment-to-moment decisions rather than simple stat-checks. This feature defines the framework for enemy roles, telegraphed dangers, counterplay mechanics, and AI behavior priorities.

## Problem / Why

Without a structured enemy system, combat risks becoming a mindless "gear check" or a chaotic mess of overlapping effects. We need enemies that players can "read" and react to, rewarding skill and coordination. This framework ensures that every enemy added to the game provides a meaningful tactical challenge and contributes to a balanced, rhythmic combat experience.

## Proposal / What

We will implement a role-based enemy system where each unit type has a specific mechanical identity. AI will use a readable state machine and role-specific targeting priorities to create predictable but challenging encounters.

### Interrupt & Break Mechanics (Hybrid Model)

We use a two-tiered system to manage enemy disruption, balancing specialized utility with team coordination.

1.  **Interruptible (Soft Casts)**: Standard moves from minions and most elites.
    *   **Rule**: Stopped instantly by any ability tagged with "Interrupt" (e.g., Shield Saint Bash).
    *   **Visual**: A standard cast bar/aura that flickers when threatened.
2.  **Breakable (Hard Casts)**: Signature moves from Champions and Bosses.
    *   **Rule**: Requires a **Break Check**. The team must fill a **Break Meter** during the wind-up window.
    *   **Impact Sources**: "Interrupt/Breaker" tags provide high impact; heavy hits/knockbacks provide medium impact; light hits provide little to no impact.
    *   **Final Blow**: The final hit to fill the meter MUST be an "Interrupt" or "Breaker" tagged action to trigger the Stagger.
    *   **Result**: The cast is cancelled, and the enemy enters a **Stagger** state (stunned + damage vulnerability).

### Targeting Logic (Blended Weighting)

Enemies evaluate targets using a dynamic scoring system rather than hard-coded rules, ensuring that role identity and tank relevance coexist.

1.  **Everything is a Score**:
    `Target Score = (Role Weight) + (Threat Bias) + (Proximity/LOS) + (Interaction History) - (Avoidance Penalties)`
2.  **Role Floors**: Each role has a minimum priority floor it will try to satisfy unless broken.
    *   **Assassin**: Target must be isolated OR below X% HP.
    *   **Artillery**: Maintain distance + Line of Sight.
    *   **Controller**: Hit multiple targets OR interrupt channels.
    *   **Bruiser**: Closest viable threat.
3.  **Threat Bias (Soft Taunt)**: Bias is a strong additive multiplier that decays over time. It spikes when the Shield Saint blocks heavy hits, interrupts casts, or uses taunt abilities.
4.  **Break Conditions**: Enemies may ignore the tank temporarily when high-value role conditions are met (e.g., an isolated target appears) or if the Shield Saint is CC'd/unreachable.

#### Targeting Behaviour by Tier
| Tier | Behaviour |
|------|-----------|
| **Minion** | Bias-heavy; simple; sticks to the Shield Saint. |
| **Elite** | Bias-first; then role checks. |
| **Champion** | Role-first; Bias as a strong secondary. |
| **Boss** | Phase-based (explicit rules per phase). |

### Requirements

#### Functional
- **FR-001**: System MUST support a Registry of Enemy Archetypes (Bruiser, Tank, Artillery, etc.).
- **FR-002**: Enemies MUST use a State Machine: `Idle/Patrol` → `Engage` → `Pressure` → `Recover` → `Reposition`.
- **FR-003**: System MUST support Telegraphed Attacks with distinct `Wind-up`, `Impact`, and `Aftermath` phases.
- **FR-004**: System MUST implement the **Hybrid Interrupt Model** (Soft vs. Hard Casts).
- **FR-005**: Enemies MUST support `Stagger` windows based on Break Meter thresholds.
- **FR-006**: Targeting logic MUST use **Blended Weighting** with Role Floors.
- **FR-007**: Every major attack MUST include a visual ground indicator or distinct audio/VFX cue.

#### Key Entities
- **EnemyArchetype**: Data-driven definition of role, moves, and tiers.
- **AIBrain**: Handles scoring-based target selection and state transitions.
- **TelegraphService**: Manages ground markers and visual cues.
- **BreakMeter**: Tracks impact damage for Hard Casts.

## Open Questions

- **Q1: Interrupt Threshold**: Resolved (Hybrid Model).
- **Q2: Soft Taunt Interaction**: Resolved (Blended Weighting with Role Floors).
- **Q3: Environment Hazards**: Should Hazards (turrets/vents) use the same AI state machine or a simplified pattern system? (Default: Simplified pattern).

## Success Criteria

- **SC-001**: A player can identify an enemy's role based on its silhouette and first move within 3 seconds.
- **SC-002**: 100% of "Heavy" attacks have a telegraph that allows a player with standard reaction time (250ms) to avoid damage.
- **SC-003**: A Champion can be reliably staggered by two players using high-impact skills simultaneously.
- **SC-004**: Enemy AI recovers for at least 0.5s after a major move, providing a clear counter-attack window.

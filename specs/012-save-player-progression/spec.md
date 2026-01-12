# Save Player Progression

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-12
**Feature Branch**: `012-save-player-progression`
**Input**: User description: "saving player state, selected class and abilities, and level progression for all chars/classes a player have to roblox's datastore"

## Summary

Implement a persistent storage system to save and retrieve player progression data across game sessions using Roblox DataStore. This feature ensures that a player's selected class, equipped abilities, and experience/level progression for every character class they own are preserved, allowing for long-term advancement and retention.

## Problem / Why

Currently, player state is likely ephemeral or reset upon leaving the game session. This prevents any meaningful long-term progression, as players lose all earned levels and configurations when they disconnect. To support a core RPG loop, players must be able to invest time in their characters with the assurance that their efforts (leveling up, customizing loadouts) are saved. Without persistence, the game is limited to single-session experiences.

## Proposal / What

We will introduce a robust data persistence layer that handles the lifecycle of player data: loading upon join, auto-saving during gameplay, and saving upon exit. The data model will be structured to support multiple character classes per player, tracking progress independently for each.

### User Scenarios & Testing

#### User Story 1 - New Player Initialization (Priority: P1)
**Description**: A first-time player joins the game and is initialized with a default empty state or starting class configuration.
**Value**: Critical for onboarding new users without errors.
**Independent Test**: Join with a fresh account ID; verify default class is selected and level is 1.
**Acceptance Scenarios**:
1. **Given** a player with no previous record, **When** they join the server, **Then** a new data profile is created with default values (Level 1, Starter Class).

#### User Story 2 - Returning Player Persistence (Priority: P1)
**Description**: A player who has previously played returns to the game and resumes exactly where they left off.
**Value**: Core retention feature; players keep their progress.
**Independent Test**: Modify player state (gain XP), leave, rejoin; verify state matches.
**Acceptance Scenarios**:
1. **Given** a player who reached Level 5 on "Knight" and equipped "Shield Bash", **When** they leave and rejoin, **Then** they spawn as a Level 5 Knight with "Shield Bash" equipped.

#### User Story 3 - Multi-Class Progression (Priority: P2)
**Description**: A player progresses on multiple different classes. Progress on inactive classes is preserved.
**Value**: Encourages experimenting with different playstyles without losing progress on the main class.
**Independent Test**: Level up Class A, switch to Class B, level up Class B, switch back to A; verify A's level is unchanged.
**Acceptance Scenarios**:
1. **Given** a player has Level 10 "Mage" and Level 2 "Warrior", **When** they play as "Warrior", **Then** the "Mage" data remains safe and unchanged in the background.

### Requirements

#### Functional
- **FR-001**: System MUST load player data from the DataStore within a reasonable time upon player connection.
- **FR-002**: System MUST save player data to the DataStore when the player disconnects.
- **FR-003**: System MUST support an auto-save mechanism to persist data at regular intervals to mitigate data loss during server crashes.
- **FR-004**: System MUST store the currently selected class ID.
- **FR-005**: System MUST store the list of equipped abilities (loadout) for the active class.
- **FR-006**: System MUST store experience points (XP) and Level independently for every class the player has unlocked.
- **FR-007**: System MUST handle data loading failures gracefully (e.g., kick player or retry, preventing overwrite of empty data).

#### Key Entities
- **PlayerProfile**: The root document for a player's persistent data.
- **ClassRecord**: Contains data specific to a single class (XP, Level, Loadout).
- **Loadout**: A list of identifiers for equipped abilities.

### Edge Cases
- **DataStore Failure**: Roblox services are down. Player should be notified and potentially prevented from playing to avoid progress loss (or warned that progress won't save).
- **Rapid Rejoining**: Player leaves and joins another server immediately before the first saves. Session locking should prevent data race conditions.
- **New Class Added**: Game updates with a new class; existing profiles must adapt to include this new class structure without errors.

## Technical / How

The solution will utilize the platform's persistent data storage service. A structured data management module will handle I/O operations, ensuring data integrity and safety.
- **Data Structure**: A dictionary keyed by User ID containing all character classes and global state.
- **Session Locking**: To prevent data overwrites from concurrent sessions.
- **Serialization**: Converting runtime objects (e.g., equipped items) into serializable identifiers for storage.

## Risks

- **Data Loss**: If the session ends unexpectedly (server crash) before data is persisted.
    - *Mitigation*: Frequent autosaves and robust shutdown handling mechanisms.
- **Throttling**: Exceeding platform storage rate limits with too many requests.
    - *Mitigation*: Request batching and respecting write intervals (e.g., autosave every 5 minutes, not every 10 seconds).
- **Schema Conflicts**: Future updates changing the data format.
    - *Mitigation*: Include a `SchemaVersion` field to allow for migration logic in the future.

## Open Questions

- None.

## Success Criteria

- **SC-001**: Players retain 100% of earned XP and Levels across sessions in normal network conditions.
- **SC-002**: Switching classes preserves the exact state of the previously active class.
- **SC-003**: Data loads successfully for 99% of sessions within 5 seconds of joining.

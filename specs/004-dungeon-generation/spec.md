# Dungeon Generation

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-06
**Feature Branch**: `004-dungeon-generation`
**Input**: "Defines how tile-based procedural dungeons are assembled, validated, and tuned."

## Summary

This feature defines how tile-based procedural dungeons are assembled, validated, and tuned for IronGuard Mercs. It establishes a robust generation pipeline that combines pre-defined tile assets (rooms, halls) according to strict connectivity rules. The system prioritizes connectivity validation and metadata injection (e.g., spawn points, enemy zones) to ensure every generated map is playable and replayable.

## Problem / Why

Replayability depends on this being solid. Hand-crafting every map is not scalable, but purely random generation often creates broken or boring layouts. We need a system that balances structural logic with procedural variety, ensuring that players encounter fresh tactical challenges without encountering unplayable geometry or dead ends.

## Proposal / What

We will implement a **Connector-Based** generation algorithm (Graph/Tree style). The system assembles the dungeon from a library of "Tile Modules" (Roblox Models representing 3D space).

### User Scenarios & Testing

#### User Story 1 - Assemble Dungeon (Priority: P1)
**Description**: The generator selects and places tiles to form a coherent layout, respecting doorway standards (e.g., "North Door must match South Door").
**Value**: Core function. Ensures the geometry physically fits together.
**Independent Test**: Define a small set of 3 tiles. Run generator. Verify all placed tiles align at their connectors without overlap or gaps.

#### User Story 2 - Validation Pass (Priority: P1)
**Description**: After assembly, the system runs a validation check (e.g., A* or flood fill) to ensure the Start point connects to the End point.
**Value**: Prevents broken seeds from being served to players.
**Independent Test**: Generate a dungeon. Block a critical path manually. Run validation. Verify it returns "Invalid". Unblock. Run validation. Verify "Valid".

#### User Story 3 - Metadata Injection (Priority: P2)
**Description**: The system parses "Metadata Parts" inside the tiles (e.g., `SpawnLocation`, `EnemySpot`) and converts them into gameplay data.
**Value**: Bridges the gap between geometry and gameplay logic.
**Independent Test**: Create a tile with a `SpawnPoint` marker. Generate dungeon containing this tile. Verify game state reads the correct Vector3 for spawning.

### Requirements

#### Functional
- **FR-001**: System MUST assemble dungeons using a library of pre-defined **Tile Modules**.
- **FR-002**: System MUST enforce **Doorway Standards** (size, position, connection logic) for all tiles.
- **FR-003**: System MUST implement a **Fail Handling** mechanism (e.g., retry loop) if generation creates an invalid layout.
- **FR-004**: System MUST validate connectivity (Start -> End) before confirming a map.
- **FR-005**: System MUST extract metadata (spawns, loot points) from the generated geometry.
- **FR-006**: System MUST use a **Connector-Based** growth algorithm (Start -> Path -> Goal) to ensure pacing and flow.
- **FR-007**: System MUST use **2D Layout Logic** (all tiles snap to a single Y-plane) while allowing verticality within tiles.
- **FR-008**: Decoration MUST be handled via a secondary **Procedural Pass** using predefined nodes within tiles.

#### Key Entities
- **TileSet**: Collection of available Room/Corridor modules.
- **DungeonGraph**: Abstract representation of the connected rooms.
- **GeneratorConfig**: Settings for size, biome, and difficulty.
- **PropSet**: Collection of decoration assets grouped by tag.

### Edge Cases
- Generator runs out of valid moves (WFC collapse).
- A valid geometry is created, but navmesh cannot be generated.
- "Infinite Loop" where a required room type never spawns.

## Technical / How

**Platform**: Roblox (Luau).
We will use a **Connector-Based** approach. Each Tile Model will have "Connector" attachments. The algorithm picks a starting tile, then iteratively picks compatible neighbors for its open connectors.
*   **Fail Handling**: If a branch cannot be completed, backtrace and retry. If total failures > X, restart entire seed.

**Algorithm Rationale (Connector-Based vs WFC)**:
We selected Connector-Based Growth over Wave Function Collapse (WFC) because:
1.  **Pacing & Flow Control**: Allows explicit structuring (e.g., Easy Room -> Medium Room -> Side Branch -> Boss). WFC is too chaotic for paced tactical levels.
2.  **Tactical Readability**: We can hand-author tiles for specific tactical roles (choke points, arenas) and place them logically.
3.  **Control**: "Feels authored but changes each run."

**Verticality Approach (2D Layout, 3D Look)**:
We strictly enforce 2D generation and connectivity (X/Z space) to manage complexity.
1.  **Complexity Management**: Avoids the massive overhead of 3D pathfinding, camera headaches, and vertical connectors (elevators/stairs) that must line up proceduraly.
2.  **Tactical Readability**: Combat is easier to read and manage in a mostly flat environment.
3.  **Faking Verticality**: Vertical features (balconies, raised platforms, slopes) are hand-authored *within* a single tile. The generator treats the tile as a single 2D node.
4.  **Extensibility**: This approach is easier to extend later (e.g., teleporting between 2D floors) without breaking the core logic.

**Decoration Strategy (Procedural with Guardrails)**:
We use a **Hybrid Procedural** approach to maximize variety while maintaining performance and gameplay integrity.
1.  **Hero Props**: Tiles may include 0-2 fixed "Hero Props" (pillars, machinery) for strong visual identity.
2.  **Decoration Nodes**: Tiles contain invisible "Node" parts (e.g., `Wall_Low`, `Corner_Clutter`) that define valid spawn locations.
3.  **Tagged Pools**: Props are organized by tags (`small`, `blocking`, `cover`). Nodes declare which tags they accept.
4.  **Deterministic RNG**: Decoration uses the same seed as the layout, ensuring consistency across reloads.
5.  **Hard Limits**: Max props per tile are capped to prevent performance issues.

## Risks
- **Asset Overhead**: Creating enough modular tiles to feel "varied" is art-intensive. Mitigation: Use generic geometry with interchangeable props.
- **Performance**: large physical maps can lag the server. Mitigation: Stream in/out or simple geometry for collision.

## Open Questions
- **Q1: Connectivity Logic**: Resolved (Connector-Based Growth).
- **Q2: Verticality Support**: Resolved (2D Layout, 3D Look).
- **Q3: Decoration Strategy**: Resolved (Procedural with Guardrails).

## Success Criteria
- **SC-001**: 95% of seeds produce a valid dungeon on the first attempt.
- **SC-002**: Validation pass catches 100% of disconnected layouts.
- **SC-003**: Metadata extraction (finding all EnemySpots) is accurate to <1 stud.
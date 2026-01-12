# Dungeon Generation Algorithm

**Status**: Implemented  
**Last Updated**: 2026-01-11  
**Source Code**: `src/shared/algorithms/dungeon-gen.ts`

## Overview

The dungeon generation uses a **linear path-first** approach with optional side branches. It builds a main path from Start to Boss room, ensuring there's always a valid route through the dungeon.

## Algorithm Phases

### Phase 1: Place Start Room

1. Find tile with `"Start"` tag (or fallback to any tile with connectors)
2. Place at world origin `(0, 0, 0)` with rotation `0`
3. **Pick ONE random connector** from the Start tile's available connectors
4. Add that single connector to the "frontier" list
5. All other connectors on Start will be blocked with solid walls

**Key Design Decision**: Start room uses only ONE exit to ensure:
- Players have a clear direction to go
- No confusion about which way leads to the boss
- Other exits are visually blocked (brick walls)

### Phase 2: Build Main Linear Path

```
while (pathLength < minPathLength AND attempts < maxAttempts AND frontier not empty):
    1. Pick random connector from frontier
    2. Select tile based on PACING RULES:
       - If consecutive corridors >= currentPacingLimit → MUST pick a room tile (3+ connectors)
       - currentPacingLimit is randomly set to 1, 2, or 3 after each room placement
       - Otherwise → Pick random "linear" tile (2 connectors) or room tile
    3. Find valid placement where:
       - Connector directions are OPPOSITE (North ↔ South, East ↔ West)
       - New tile doesn't collide with existing tiles (AABB check)
    4. If valid placement found:
       - Add new node to graph
       - Create edge between source and new node
       - Track which connector directions are "used" on both tiles
       - Remove used connector from frontier
       - Move other connectors from same source to "branch" list
       - Add new tile's unused connectors to frontier
       - Increment pathLength
```

**Room Pacing Rule**: To prevent monotonous corridor sequences:
- Track consecutive corridor placements
- After 1-3 corridors in a row (randomly determined), force placement of a "big room" (tile with 3+ connectors like `Room40x40`, `LargeRoom60x60`, `Crossroad40`)
- The pacing limit is re-randomized (1-3) after each room placement
- This ensures variety: `Corridor → ROOM → Corridor → Corridor → Corridor → ROOM → Corridor → ROOM → ...`

**Linear Tiles Preference**: The algorithm prefers tiles with exactly 2 connectors (hallways) for the main path, but enforces room placement every 2-3 tiles to break up the linearity.

### Phase 3: Place Boss Room (End Tile)

1. Combine all remaining connectors: `frontier + branchConnectors`
2. Sort by `distanceFromStart` (farthest first)
3. For each connector (starting from farthest):
   - Try to place the EndRoom tile (tile with `"End"` tag)
   - Check for valid connector match and no collision
   - If valid, place it and stop searching
4. Mark as `"BossRoom"` with `"MainPath"` tag

**Key Design Decision**: Boss room is placed at the **farthest available connector** from start, ensuring players must traverse the dungeon to reach it.

### Phase 4: Optional Side Branches

```
while (branchCount < maxBranches AND branchConnectors not empty AND branchRoomsAdded < maxBranchRooms):
    1. Pick random connector from branchConnectors
    2. Pick random non-End tile
    3. Try to place (same collision/connector checks)
    4. If placed, tag as "Branch" (not MainPath)
```

Branches are dead-ends that add variety but don't lead to the boss.

## Connector Matching Logic

Connectors must face **opposite directions** to connect:

| Source Direction | Required Target Direction |
|-----------------|---------------------------|
| North (-Z)      | South (+Z)                |
| South (+Z)      | North (-Z)                |
| East (+X)       | West (-X)                 |
| West (-X)       | East (+X)                 |

### Position Calculation

When placing a new tile connected to an existing connector:

```typescript
newTilePosition = sourceConnectorGlobalPosition - rotatedLocalConnectorOffset
```

**Example**:
- Source connector at global `(40, 0, 0)` facing East
- New tile has connector at local `(-20, 0, 0)` facing West
- New tile center = `(40, 0, 0) - (-20, 0, 0)` = `(60, 0, 0)`

### Rotation

Tiles can be rotated in 90° increments:

| Rotation Value | Degrees | Effect |
|---------------|---------|--------|
| 0 | 0°   | North stays North |
| 1 | 90°  | North becomes East |
| 2 | 180° | North becomes South |
| 3 | 270° | North becomes West |

Connector directions and local positions are rotated accordingly.

## Collision Detection

AABB (Axis-Aligned Bounding Box) overlap check:

```typescript
function aabbOverlap(b1, b2): boolean {
    return (b1.min.x < b2.max.x && b1.max.x > b2.min.x) &&
           (b1.min.z < b2.max.z && b1.max.z > b2.min.z);
}
```

Bounds are calculated from tile center position and size, with a small epsilon shrink (0.1 studs) to prevent false positives from floating-point precision.

## Data Structures

### GraphNode

```typescript
interface GraphNode {
    id: string;                           // "Start" | "Path_N" | "BossRoom" | "Branch_N_M"
    tileId: string;                       // Reference to TileAsset (e.g., "Room40x40")
    position: Vec3;                       // World position (center of tile)
    rotation: number;                     // 0-3 (90° increments)
    bounds: { min: Vec3, max: Vec3 };     // For collision detection
    tags: string[];                       // ["StartRoom", "MainPath"] | ["BossRoom"] | ["Branch"]
    distanceFromStart: number;            // 0 for Start, increments along path, -1 for branches
    usedConnectorDirections: ConnectorDirection[];  // Which exits are connected to other rooms
}
```

### GraphEdge

```typescript
interface GraphEdge {
    from: string;                    // Source node ID
    to: string;                      // Target node ID
    connectorType: string;           // e.g., "Standard"
    fromDirection: ConnectorDirection;  // Direction on source node
    toDirection: ConnectorDirection;    // Direction on target node
}
```

### DungeonGraph

```typescript
interface DungeonGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    startNodeId: string;          // Always "Start"
    endNodeId?: string;           // "BossRoom" if placed successfully
    mainPathLength: number;       // Count of nodes tagged "MainPath"
}
```

### GenerationConfig

```typescript
interface GenerationConfig {
    targetSize: number;      // Total rooms (main + branches)
    maxAttempts: number;     // Max placement attempts before giving up
    minPathLength: number;   // Minimum rooms from Start to Boss
    maxBranches: number;     // Maximum side branch rooms (0 for purely linear)
}
```

## Visual Representation

```
    ████████████
    █  START   █ ←── Only 1 exit (others blocked with brick walls)
    █          █
    ████═══█████
         ║
    █████╬██████
    █  Path_1  █ ←── Linear tile, door frames on used exits
    █          █
    ████═══█████
         ║
    █████╬██████
    █  Path_2  █
    █          █
    ████═══█████
         ║
        ...
         ║
    █████╬██████
    █  Path_N  █
    █          █
    ████═══█████
         ║
    █████╬██████
    █   BOSS   █ ←── EndRoom at farthest point
    █  (red)   █
    ████████████

Legend:
═══ = Door frame (openable passage)
███ = Solid wall (blocked exit)
```

## Runtime Wall/Door Generation

At spawn time, the `DungeonService` processes each node:

### For CORRIDORS (2 connectors - hallways, passages):
- **Used connectors**: Stay completely open (no door frame)
- **Unused connectors**: Blocked with solid brick wall

### For ROOMS (3+ connectors - chambers, crossroads):
- **Used connectors**: Door frame (brown wooden frame with semi-transparent door)
- **Unused connectors**: Blocked with solid brick wall

### For START and BOSS rooms:
- **Entrance**: Door frame (openable passage)
- **Unused exits**: Blocked with solid brick wall

### Visual Distinction:
- **Solid Wall** (blocked): Brick material, Dark taupe color, CanCollide = true
- **Door Frame** (passage): Brown wooden pillars + top beam, semi-transparent door (CanCollide = false)

This is handled by `blockUnusedExits()` in `DungeonService.ts`.

## Validation

After generation, the dungeon is validated:

```typescript
function validateDungeon(graph): { valid: boolean; reason?: string } {
    if (nodes.length === 0) return { valid: false, reason: "No nodes in graph" };
    if (!endNodeId) return { valid: false, reason: "No end room placed" };
    
    const paths = findAllPaths(graph, 1);  // BFS pathfinding
    if (paths.length === 0) return { valid: false, reason: "No path from start to end" };
    
    return { valid: true };
}
```

## Retry Logic

The `DungeonService` implements retry logic for failed generations:

```typescript
let attempts = 0;
const maxAttempts = 5;

do {
    graph = generateDungeonGraph(currentSeed, tileset, config);
    validation = validateDungeon(graph);
    
    if (!validation.valid) {
        currentSeed = seed + attempts + 1;  // Try different seed
    }
    attempts++;
} while (!validation.valid && attempts < maxAttempts);
```

## Tile Requirements

### Start Tile
- Tag: `"Start"`
- Should have multiple connectors (algorithm picks one randomly)
- Contains `PlayerSpawn` marker parts

### End Tile (Boss Room)
- Tag: `"End"`
- Typically has only 1 connector (entrance only)
- Contains `BossSpawn` and `LootSpawn` marker parts
- Visually distinct (red walls)

### Path Tiles
- No special tags required
- **Linear tiles** (2 connectors): Preferred for main path (hallways, corridors)
- **Branch tiles** (3+ connectors): Used for intersections and variety
- Should contain `EnemySpawn` marker parts

## Configuration Defaults

```typescript
const DEFAULT_CONFIG: GenerationConfig = {
    targetSize: 12,
    maxAttempts: 500,
    minPathLength: 8,
    maxBranches: 3
};
```

## Helper Functions

### Exported

| Function | Description |
|----------|-------------|
| `generateDungeonGraph()` | Main generation function |
| `generateGraph()` | Legacy wrapper (returns just nodes) |
| `findAllPaths()` | BFS pathfinding from start to end |
| `validateDungeon()` | Checks graph validity |
| `countRoutes()` | Counts distinct paths to boss |
| `getShortestPathLength()` | Returns minimum path length |
| `getMainPathNodes()` | Returns only MainPath-tagged nodes |

### Internal

| Function | Description |
|----------|-------------|
| `calculateBounds()` | Computes AABB from position/size/rotation |
| `checkCollision()` | Tests AABB overlap against all nodes |
| `rotateDirection()` | Rotates connector direction by N×90° |
| `rotateVec3()` | Rotates a vector by N×90° |
| `buildAdjacencyList()` | Builds bidirectional graph for pathfinding |


import { TileAsset, ConnectorDirection } from "../domain/TileDefs";
import { RNG } from "./rng";
import { Vec3 } from "../domain/world";
import { findValidPlacements, GlobalConnector } from "./connector-logic";

export interface GraphNode {
    id: string;
    tileId: string;
    position: Vec3;
    rotation: number;
    bounds: { min: Vec3; max: Vec3 };
    tags: string[];
    distanceFromStart: number; // How many steps from start on the main path
    usedConnectorDirections: ConnectorDirection[]; // Which directions have connections (after rotation)
}

export interface GraphEdge {
    from: string; // Node ID
    to: string;   // Node ID
    connectorType: string;
    fromDirection: ConnectorDirection; // Direction on the 'from' node
    toDirection: ConnectorDirection;   // Direction on the 'to' node
}

export interface DungeonGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    startNodeId: string;
    endNodeId?: string;
    mainPathLength: number; // Number of rooms in the main path (Start -> Boss)
}

export interface GenerationConfig {
    targetSize: number;
    maxAttempts: number;
    minPathLength: number; // Minimum rooms from Start to Boss (main path)
    maxBranches: number;   // Maximum side branches (0 for purely linear)
}

const DEFAULT_CONFIG: GenerationConfig = {
    targetSize: 12,
    maxAttempts: 500,
    minPathLength: 8,  // At least 8 rooms to get to boss
    maxBranches: 3     // Allow up to 3 small side branches
};

type ConnectorWithNode = GlobalConnector & { nodeId: string; distanceFromStart: number };

/**
 * Generates a dungeon graph with a guaranteed linear main path from Start to Boss.
 * The main path is built first, then optional side branches are added.
 */
export function generateDungeonGraph(
    seed: number,
    tileset: TileAsset[],
    config: Partial<GenerationConfig> = {}
): DungeonGraph {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const rng = new RNG(seed);

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    if (tileset.size() === 0) {
        return { nodes: [], edges: [], startNodeId: "", mainPathLength: 0 };
    }

    // Get tile categories
    const startTile = tileset.find((t) => t.tags.includes("Start"))
        ?? tileset.find((t) => t.connectors.size() > 0)
        ?? tileset[0];
    const endTile = tileset.find((t) => t.tags.includes("End"));
    const pathTiles = tileset.filter((t) => !t.tags.includes("End") && !t.tags.includes("Start"));

    // Prefer hallways/corridors for the main path (2 connectors = linear)
    const linearTiles = pathTiles.filter((t) => t.connectors.size() === 2);

    // === PHASE 1: Build the main linear path ===

    // Place Start
    const rootPos = { x: 0, y: 0, z: 0 };
    const rootNode: GraphNode = {
        id: "Start",
        tileId: startTile.id,
        position: rootPos,
        rotation: 0,
        bounds: calculateBounds(rootPos, startTile.size, 0),
        tags: [...startTile.tags, "StartRoom", "MainPath"],
        distanceFromStart: 0,
        usedConnectorDirections: []
    };
    nodes.push(rootNode);

    // Track the "frontier" - the leading edge of the main path
    let frontierConnectors: ConnectorWithNode[] = [];

    // For Start room: only use ONE connector (pick randomly), block the rest
    // This ensures the start room has exactly one exit
    if (startTile.connectors.size() > 0) {
        const startConnectorIdx = rng.range(0, startTile.connectors.size() - 1);
        const chosenConnector = startTile.connectors[startConnectorIdx];
        const rDir = rotateDirection(chosenConnector.direction, 0);
        const rOffset = rotateVec3(chosenConnector.localPosition, 0);

        frontierConnectors.push({
            position: { x: rootPos.x + rOffset.x, y: rootPos.y + rOffset.y, z: rootPos.z + rOffset.z },
            direction: rDir,
            type: chosenConnector.type,
            nodeId: rootNode.id,
            distanceFromStart: 0
        });
    }

    // Build main path by always extending from the furthest point
    let pathLength = 1; // Start counts as 1
    let nodeCounter = 1;
    let attempts = 0;
    const maxPathAttempts = cfg.maxAttempts;

    // Room pacing: track consecutive corridor placements
    let consecutiveCorridors = 0;
    let currentPacingLimit = rng.range(1, 3); // Random 1-3 corridors before forcing a room

    // Store connectors that branch off main path for later
    const branchConnectors: ConnectorWithNode[] = [];

    // Room tiles (3+ connectors) for pacing variety
    const roomTiles = pathTiles.filter((t) => t.connectors.size() >= 3);

    while (pathLength < cfg.minPathLength && attempts < maxPathAttempts && frontierConnectors.size() > 0) {
        attempts++;

        // Pick a random connector from the frontier
        const connIdx = rng.range(0, frontierConnectors.size() - 1);
        const sourceConn = frontierConnectors[connIdx];

        // Room pacing: if we've had too many corridors, force a room
        let availableTiles: TileAsset[];
        if (consecutiveCorridors >= currentPacingLimit && roomTiles.size() > 0) {
            // Force a big room
            availableTiles = roomTiles;
        } else {
            // Prefer linear tiles but allow rooms too
            availableTiles = linearTiles.size() > 0 ? linearTiles : pathTiles;
        }

        if (availableTiles.size() === 0) {
            availableTiles = pathTiles; // Fallback to any path tile
        }
        if (availableTiles.size() === 0) break;

        const candidateTile = availableTiles[rng.range(0, availableTiles.size() - 1)];
        const placements = findValidPlacements(sourceConn, candidateTile);

        if (placements.size() === 0) {
            // Can't place here, try another connector
            continue;
        }

        const pick = placements[rng.range(0, placements.size() - 1)];
        const newBounds = calculateBounds(pick.position, candidateTile.size, pick.rotation);

        if (!checkCollision(newBounds, nodes)) {
            // Track corridor pacing
            if (candidateTile.connectors.size() === 2) {
                consecutiveCorridors++;
            } else {
                consecutiveCorridors = 0; // Reset on room placement
                currentPacingLimit = rng.range(1, 3); // Re-randomize for next sequence
            }
            const newNodeId = `Path_${nodeCounter++}`;
            const newDistance = sourceConn.distanceFromStart + 1;

            // Calculate the direction used on the new tile (rotated)
            const usedConnector = candidateTile.connectors[pick.connectedVia];
            const usedDirOnNewTile = rotateDirection(usedConnector.direction, pick.rotation);

            const newNode: GraphNode = {
                id: newNodeId,
                tileId: pick.tileId,
                position: pick.position,
                rotation: pick.rotation,
                bounds: newBounds,
                tags: [...candidateTile.tags, "MainPath"],
                distanceFromStart: newDistance,
                usedConnectorDirections: [usedDirOnNewTile]
            };
            nodes.push(newNode);

            // Mark the source node's connector as used
            const sourceNode = nodes.find(n => n.id === sourceConn.nodeId);
            if (sourceNode) {
                sourceNode.usedConnectorDirections.push(sourceConn.direction);
            }

            edges.push({
                from: sourceConn.nodeId,
                to: newNodeId,
                connectorType: sourceConn.type,
                fromDirection: sourceConn.direction,
                toDirection: usedDirOnNewTile
            });

            // Remove used connector from frontier
            frontierConnectors.remove(connIdx);

            // Move other connectors from this source to branch list (they're not main path)
            const otherFromSameSource = frontierConnectors.filter(c => c.nodeId === sourceConn.nodeId);
            for (const other of otherFromSameSource) {
                branchConnectors.push(other);
                const idx = frontierConnectors.indexOf(other);
                if (idx >= 0) frontierConnectors.remove(idx);
            }

            // Add new node's connectors to frontier (except the one we used)
            for (let i = 0; i < candidateTile.connectors.size(); i++) {
                if (i === pick.connectedVia) continue;

                const c = candidateTile.connectors[i];
                const rDir = rotateDirection(c.direction, pick.rotation);
                const rOffset = rotateVec3(c.localPosition, pick.rotation);
                frontierConnectors.push({
                    position: {
                        x: pick.position.x + rOffset.x,
                        y: pick.position.y + rOffset.y,
                        z: pick.position.z + rOffset.z
                    },
                    direction: rDir,
                    type: c.type,
                    nodeId: newNodeId,
                    distanceFromStart: newDistance
                });
            }

            pathLength++;
        }
    }

    // === PHASE 2: Place the Boss Room at the end of main path ===
    let endNodeId: string | undefined;

    // Only use frontier connectors for boss - these are at the TRUE end of the main path
    // branchConnectors are side paths, not where the boss should go
    if (endTile && frontierConnectors.size() > 0) {
        // Sort frontier connectors by distance - place boss at farthest point on main path
        const sortedConnectors = [...frontierConnectors].sort((a, b) => {
            return b.distanceFromStart - a.distanceFromStart;
        });

        for (const sourceConn of sortedConnectors) {
            const placements = findValidPlacements(sourceConn, endTile);

            for (const pick of placements) {
                const newBounds = calculateBounds(pick.position, endTile.size, pick.rotation);
                if (!checkCollision(newBounds, nodes)) {
                    endNodeId = "BossRoom";

                    // Calculate the direction used on the boss room tile (rotated)
                    const usedConnector = endTile.connectors[pick.connectedVia];
                    const usedDirOnBoss = rotateDirection(usedConnector.direction, pick.rotation);

                    const endNode: GraphNode = {
                        id: endNodeId,
                        tileId: pick.tileId,
                        position: pick.position,
                        rotation: pick.rotation,
                        bounds: newBounds,
                        tags: [...endTile.tags, "BossRoom", "MainPath"],
                        distanceFromStart: sourceConn.distanceFromStart + 1,
                        usedConnectorDirections: [usedDirOnBoss]
                    };
                    nodes.push(endNode);

                    // Mark the source node's connector as used
                    const sourceNode = nodes.find(n => n.id === sourceConn.nodeId);
                    if (sourceNode) {
                        sourceNode.usedConnectorDirections.push(sourceConn.direction);
                    }

                    edges.push({
                        from: sourceConn.nodeId,
                        to: endNodeId,
                        connectorType: sourceConn.type,
                        fromDirection: sourceConn.direction,
                        toDirection: usedDirOnBoss
                    });

                    // Remove used connector
                    const idx = frontierConnectors.indexOf(sourceConn);
                    if (idx >= 0) frontierConnectors.remove(idx);

                    pathLength++;
                    break;
                }
            }
            if (endNodeId) break;
        }
    }

    // Fallback: if boss wasn't placed and we have branch connectors, try those
    if (!endNodeId && endTile && branchConnectors.size() > 0) {
        const sortedBranch = [...branchConnectors].sort((a, b) => {
            return b.distanceFromStart - a.distanceFromStart;
        });

        for (const sourceConn of sortedBranch) {
            const placements = findValidPlacements(sourceConn, endTile);

            for (const pick of placements) {
                const newBounds = calculateBounds(pick.position, endTile.size, pick.rotation);
                if (!checkCollision(newBounds, nodes)) {
                    endNodeId = "BossRoom";

                    const usedConnector = endTile.connectors[pick.connectedVia];
                    const usedDirOnBoss = rotateDirection(usedConnector.direction, pick.rotation);

                    const endNode: GraphNode = {
                        id: endNodeId,
                        tileId: pick.tileId,
                        position: pick.position,
                        rotation: pick.rotation,
                        bounds: newBounds,
                        tags: [...endTile.tags, "BossRoom", "MainPath"],
                        distanceFromStart: sourceConn.distanceFromStart + 1,
                        usedConnectorDirections: [usedDirOnBoss]
                    };
                    nodes.push(endNode);

                    const sourceNode = nodes.find(n => n.id === sourceConn.nodeId);
                    if (sourceNode) {
                        sourceNode.usedConnectorDirections.push(sourceConn.direction);
                    }

                    edges.push({
                        from: sourceConn.nodeId,
                        to: endNodeId,
                        connectorType: sourceConn.type,
                        fromDirection: sourceConn.direction,
                        toDirection: usedDirOnBoss
                    });

                    const idx = branchConnectors.indexOf(sourceConn);
                    if (idx >= 0) branchConnectors.remove(idx);

                    pathLength++;
                    break;
                }
            }
            if (endNodeId) break;
        }
    }

    // Move remaining frontier connectors to branch list
    for (const c of frontierConnectors) {
        branchConnectors.push(c);
    }

    // === PHASE 3: Optionally add side branches (limited) ===
    let branchCount = 0;
    const maxBranchRooms = cfg.targetSize - pathLength;
    let branchRoomsAdded = 0;

    while (branchCount < cfg.maxBranches && branchConnectors.size() > 0 && branchRoomsAdded < maxBranchRooms) {
        const connIdx = rng.range(0, branchConnectors.size() - 1);
        const sourceConn = branchConnectors[connIdx];

        // Use any non-end tile for branches
        const candidateTile = pathTiles[rng.range(0, pathTiles.size() - 1)];
        const placements = findValidPlacements(sourceConn, candidateTile);

        if (placements.size() === 0) {
            branchConnectors.remove(connIdx);
            continue;
        }

        const pick = placements[rng.range(0, placements.size() - 1)];
        const newBounds = calculateBounds(pick.position, candidateTile.size, pick.rotation);

        if (!checkCollision(newBounds, nodes)) {
            const newNodeId = `Branch_${branchCount}_${branchRoomsAdded}`;

            // Calculate the direction used on the branch tile (rotated)
            const usedConnector = candidateTile.connectors[pick.connectedVia];
            const usedDirOnBranch = rotateDirection(usedConnector.direction, pick.rotation);

            const newNode: GraphNode = {
                id: newNodeId,
                tileId: pick.tileId,
                position: pick.position,
                rotation: pick.rotation,
                bounds: newBounds,
                tags: [...candidateTile.tags, "Branch"],
                distanceFromStart: -1, // Not on main path
                usedConnectorDirections: [usedDirOnBranch]
            };
            nodes.push(newNode);

            // Mark the source node's connector as used
            const sourceNode = nodes.find(n => n.id === sourceConn.nodeId);
            if (sourceNode) {
                sourceNode.usedConnectorDirections.push(sourceConn.direction);
            }

            edges.push({
                from: sourceConn.nodeId,
                to: newNodeId,
                connectorType: sourceConn.type,
                fromDirection: sourceConn.direction,
                toDirection: usedDirOnBranch
            });

            branchConnectors.remove(connIdx);
            branchRoomsAdded++;
            branchCount++;
        } else {
            branchConnectors.remove(connIdx);
        }
    }

    const mainPathNodes = nodes.filter(n => n.tags.includes("MainPath"));

    return {
        nodes,
        edges,
        startNodeId: "Start",
        endNodeId,
        mainPathLength: mainPathNodes.size()
    };
}

/**
 * Legacy function for backwards compatibility
 */
export function generateGraph(seed: number, tileset: TileAsset[], targetSize = 10): GraphNode[] {
    const result = generateDungeonGraph(seed, tileset, { targetSize, minPathLength: math.floor(targetSize * 0.7) });
    return result.nodes;
}

/**
 * Find all paths from start to end using BFS
 */
export function findAllPaths(graph: DungeonGraph, maxPaths = 10): string[][] {
    if (!graph.endNodeId) return [];

    const paths: string[][] = [];
    const adjacency = buildAdjacencyList(graph);

    // BFS to find all paths (limited)
    const initialVisited = new Set<string>();
    initialVisited.add(graph.startNodeId);

    const queue: { path: string[]; visited: Set<string> }[] = [
        { path: [graph.startNodeId], visited: initialVisited }
    ];

    while (queue.size() > 0 && paths.size() < maxPaths) {
        const current = queue.shift()!;
        const lastNode = current.path[current.path.size() - 1];

        if (lastNode === graph.endNodeId) {
            paths.push([...current.path]);
            continue;
        }

        const neighbors = adjacency.get(lastNode) ?? [];
        for (const neighbor of neighbors) {
            if (!current.visited.has(neighbor)) {
                // Manually copy Set for roblox-ts compatibility
                const newVisited = new Set<string>();
                current.visited.forEach((v) => newVisited.add(v));
                newVisited.add(neighbor);
                queue.push({
                    path: [...current.path, neighbor],
                    visited: newVisited
                });
            }
        }
    }

    return paths;
}

/**
 * Check if the dungeon is valid (has path from start to end)
 */
export function validateDungeon(graph: DungeonGraph): { valid: boolean; reason?: string } {
    if (graph.nodes.size() === 0) {
        return { valid: false, reason: "No nodes in graph" };
    }

    if (!graph.endNodeId) {
        return { valid: false, reason: "No end room placed" };
    }

    const paths = findAllPaths(graph, 1);
    if (paths.size() === 0) {
        return { valid: false, reason: "No path from start to end" };
    }

    return { valid: true };
}

/**
 * Count distinct routes from start to end
 */
export function countRoutes(graph: DungeonGraph): number {
    return findAllPaths(graph, 100).size();
}

/**
 * Get the shortest path length
 */
export function getShortestPathLength(graph: DungeonGraph): number {
    const paths = findAllPaths(graph);
    if (paths.size() === 0) return -1;

    let shortest = paths[0].size();
    for (const path of paths) {
        if (path.size() < shortest) shortest = path.size();
    }
    return shortest;
}

/**
 * Get nodes that are on the main path (Start -> Boss)
 */
export function getMainPathNodes(graph: DungeonGraph): GraphNode[] {
    return graph.nodes.filter(n => n.tags.includes("MainPath"));
}

/**
 * Build adjacency list from edges (bidirectional)
 */
function buildAdjacencyList(graph: DungeonGraph): Map<string, string[]> {
    const adj = new Map<string, string[]>();

    for (const node of graph.nodes) {
        adj.set(node.id, []);
    }

    for (const edge of graph.edges) {
        adj.get(edge.from)?.push(edge.to);
        adj.get(edge.to)?.push(edge.from); // Bidirectional
    }

    return adj;
}

// === Utility Functions ===

function calculateBounds(pos: Vec3, size: Vec3, rot: number) {
    let sx = size.x;
    let sz = size.z;

    if (rot === 1 || rot === 3) {
        sx = size.z;
        sz = size.x;
    }

    const halfX = sx / 2;
    const halfZ = sz / 2;

    return {
        min: { x: pos.x - halfX + 0.1, y: 0, z: pos.z - halfZ + 0.1 },
        max: { x: pos.x + halfX - 0.1, y: size.y, z: pos.z + halfZ - 0.1 }
    };
}

function checkCollision(bounds: { min: Vec3; max: Vec3 }, nodes: GraphNode[]): boolean {
    for (const node of nodes) {
        if (aabbOverlap(bounds, node.bounds)) return true;
    }
    return false;
}

function aabbOverlap(b1: { min: Vec3; max: Vec3 }, b2: { min: Vec3; max: Vec3 }): boolean {
    return (b1.min.x < b2.max.x && b1.max.x > b2.min.x) &&
        (b1.min.z < b2.max.z && b1.max.z > b2.min.z);
}

function rotateDirection(dir: ConnectorDirection, rotations: number): ConnectorDirection {
    const dirs = [
        ConnectorDirection.North,
        ConnectorDirection.East,
        ConnectorDirection.South,
        ConnectorDirection.West
    ];
    const idx = dirs.indexOf(dir);
    return dirs[(idx + rotations) % 4];
}

function rotateVec3(v: Vec3, rotations: number): Vec3 {
    let x = v.x;
    let z = v.z;
    for (let i = 0; i < rotations; i++) {
        const oldX = x;
        x = -z;
        z = oldX;
    }
    return { x, y: v.y, z };
}
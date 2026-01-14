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
    encounterPackId?: string; // ID of the monster pack assigned to this room
    monsterBudget?: number;   // Total budget for monsters in this room
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

    // Deterministic retry loop for robust generation
    let lastResult: DungeonGraph | undefined;
    for (let retry = 0; retry < 5; retry++) {
        const result = _generateDungeonGraph(seed + retry * 1000, tileset, cfg);
        lastResult = result;

        // Success criteria: reached minimum length AND placed a boss room
        if (result.mainPathLength >= cfg.minPathLength && result.endNodeId) {
            return result;
        }
    }

    return lastResult!;
}

function _generateDungeonGraph(
    seed: number,
    tileset: TileAsset[],
    cfg: GenerationConfig
): DungeonGraph {
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
    const maxPathAttempts = 1000;

    // Room pacing: track consecutive corridor placements
    let consecutiveCorridors = 0;
    let currentPacingLimit = rng.range(1, 3); // Random 1-3 corridors before forcing a room

    // Store connectors that branch off main path for later
    const branchConnectors: ConnectorWithNode[] = [];
    const exhaustedConnectors: ConnectorWithNode[] = [];

    // Room tiles (3+ connectors) for pacing variety
    const roomTiles = pathTiles.filter((t) => t.connectors.size() >= 3);

    while (pathLength < cfg.minPathLength && attempts < maxPathAttempts) {
        if (frontierConnectors.size() === 0) {
            // BACKTRACK: If frontier is empty, take the furthest branch point and promote it
            if (branchConnectors.size() > 0) {
                // Find furthest branch point (descending order - highest distance first)
                branchConnectors.sort((a, b) => a.distanceFromStart > b.distanceFromStart);
                frontierConnectors.push(branchConnectors.remove(0)!);
            } else {
                break; // Truly stuck
            }
        }
        attempts++;

        // Pick a random connector from the frontier
        const connIdx = rng.range(0, frontierConnectors.size() - 1);
        const sourceConn = frontierConnectors[connIdx];

        let availableTiles: TileAsset[];
        if (consecutiveCorridors >= currentPacingLimit && roomTiles.size() > 0) {
            // Force a big room
            availableTiles = roomTiles;
        } else {
            // Prefer linear tiles but allow rooms too. IMPORTANT: Exclude dead-ends for the main path!
            const nonDeadEnds = pathTiles.filter(t => t.connectors.size() >= 2);
            availableTiles = linearTiles.size() > 0 ? linearTiles : nonDeadEnds;
        }

        if (availableTiles.size() === 0) {
            availableTiles = pathTiles;
        }
        if (availableTiles.size() === 0) break;

        let placed = false;
        // Try up to 15 random tiles. First 10 from preferred set, last 5 from all path tiles.
        for (let i = 0; i < 15 && !placed; i++) {
            const trialTiles = i < 10 ? availableTiles : pathTiles;
            const candidateTile = trialTiles[rng.range(0, trialTiles.size() - 1)];
            const placements = findValidPlacements(sourceConn, candidateTile);

            if (placements.size() === 0) continue;

            // Try all possible placements for this tile
            for (const pick of placements) {
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
                        if (idx >= 0) {
                            frontierConnectors.remove(idx);
                        }
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
                    placed = true;
                    break;
                }
            }
        }

        if (!placed) {
            // If we couldn't place anything after multiple attempts on this connector,
            // move it to exhausted list so we don't try it again for main path
            exhaustedConnectors.push(sourceConn);
            frontierConnectors.remove(connIdx);
        }
    }

    // === PHASE 2: Place the Boss Room at the end of main path ===
    let endNodeId: string | undefined;

    // Only use frontier connectors for boss - these are at the TRUE end of the main path
    // branchConnectors are side paths, not where the boss should go
    if (endTile && frontierConnectors.size() > 0) {
        // Sort frontier connectors by distance - place boss at farthest point on main path
        const sortedConnectors = [...frontierConnectors].sort((a, b) => {
            return a.distanceFromStart > b.distanceFromStart;
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

    // Fallback: if boss wasn't placed, try ALL other connectors including exhausted ones
    if (!endNodeId && endTile) {
        const allFallback = [...branchConnectors, ...exhaustedConnectors].sort((a, b) => a.distanceFromStart > b.distanceFromStart);

        for (const sourceConn of allFallback) {
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

    // === PHASE 3: Optionally add side branches (limited) ===
    let branchCount = 0;
    const maxBranchRooms = cfg.targetSize - nodes.size();
    let branchRoomsAdded = 0;

    // Use both remaining frontier and previous branch exits
    const potentialBranches = [...frontierConnectors, ...branchConnectors];

    while (branchCount < cfg.maxBranches && potentialBranches.size() > 0 && branchRoomsAdded < maxBranchRooms) {
        const connIdx = rng.range(0, potentialBranches.size() - 1);
        const sourceConn = potentialBranches[connIdx];

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

            branchRoomsAdded++;
            branchCount++;

            // Add new node's connectors to potential branches
            for (let i = 0; i < candidateTile.connectors.size(); i++) {
                if (i === pick.connectedVia) continue;
                const c = candidateTile.connectors[i];
                const rDir = rotateDirection(c.direction, pick.rotation);
                const rOffset = rotateVec3(c.localPosition, pick.rotation);
                potentialBranches.push({
                    position: { x: pick.position.x + rOffset.x, y: pick.position.y + rOffset.y, z: pick.position.z + rOffset.z },
                    direction: rDir,
                    type: c.type,
                    nodeId: newNodeId,
                    distanceFromStart: -1
                });
            }

            potentialBranches.remove(connIdx);
        } else {
            potentialBranches.remove(connIdx);
        }
    }

    // === PHASE 4: Retrospective Path Tagging ===
    const finalMainPathIds = new Set<string>();
    if (endNodeId) {
        let currentId = endNodeId;
        finalMainPathIds.add(currentId);

        // Trace back from Boss to Start
        while (currentId !== "Start") {
            const edge = edges.find(e => e.to === currentId);
            if (!edge) break; // Should not happen in a valid tree
            currentId = edge.from;
            finalMainPathIds.add(currentId);
        }
    } else {
        finalMainPathIds.add("Start");
    }

    // Update tags and distances based on the true path
    const nodesToRemove = new Set<string>();

    for (const node of nodes) {
        const isOnMainPath = finalMainPathIds.has(node.id);

        if (isOnMainPath) {
            if (!node.tags.includes("MainPath")) {
                node.tags.push("MainPath");
            }
            // Remove Branch tag if it was there
            const branchIdx = node.tags.indexOf("Branch");
            if (branchIdx >= 0) node.tags.remove(branchIdx);
        } else {
            // If we want 0 branches, or it was meant to be main path but failed, consider removal
            if (cfg.maxBranches === 0) {
                nodesToRemove.add(node.id);
            } else {
                // Remove MainPath tag if it was there
                const mainIdx = node.tags.indexOf("MainPath");
                if (mainIdx >= 0) {
                    node.tags.remove(mainIdx);
                    if (!node.tags.includes("Branch")) {
                        node.tags.push("Branch");
                    }
                }
            }
        }
    }

    // Perform removal if necessary
    if (getSetSize(nodesToRemove) > 0) {
        // Filter edges array and clean up usedConnectorDirections
        for (let i = edges.size() - 1; i >= 0; i--) {
            const edge = edges[i];
            const isFromRemoved = nodesToRemove.has(edge.from);
            const isToRemoved = nodesToRemove.has(edge.to);

            if (isFromRemoved || isToRemoved) {
                // If the edge itself involves a removed node, we must also update the OTHER side
                if (!isFromRemoved) {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    if (fromNode) {
                        const idx = fromNode.usedConnectorDirections.indexOf(edge.fromDirection);
                        if (idx >= 0) fromNode.usedConnectorDirections.remove(idx);
                    }
                }
                if (!isToRemoved) {
                    const toNode = nodes.find(n => n.id === edge.to);
                    if (toNode) {
                        const idx = toNode.usedConnectorDirections.indexOf(edge.toDirection);
                        if (idx >= 0) toNode.usedConnectorDirections.remove(idx);
                    }
                }
                edges.remove(i);
            }
        }

        // Filter nodes array
        for (let i = nodes.size() - 1; i >= 0; i--) {
            if (nodesToRemove.has(nodes[i].id)) {
                nodes.remove(i);
            }
        }
    }

    // Recalculate distances for ALL nodes correctly
    const distMap = new Map<string, number>();
    distMap.set("Start", 0);
    const queue: string[] = ["Start"];
    while (queue.size() > 0) {
        const currentId = queue.shift()!;
        const currentDist = distMap.get(currentId)!;

        const node = nodes.find(n => n.id === currentId);
        if (node) {
            const isOnMainPath = finalMainPathIds.has(node.id);
            node.distanceFromStart = isOnMainPath ? currentDist : -1;
        }

        const outgoingEdges = edges.filter(e => e.from === currentId);
        for (const edge of outgoingEdges) {
            if (!distMap.has(edge.to)) {
                distMap.set(edge.to, currentDist + 1);
                queue.push(edge.to);
            }
        }
    }

    const finalMainPathNodes = nodes.filter(n => n.tags.includes("MainPath"));

    return {
        nodes,
        edges,
        startNodeId: "Start",
        endNodeId,
        mainPathLength: finalMainPathNodes.size()
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

/**
 * Cross-environment compatible sort helper (Descending by distanceFromStart)
 * Works in both Node.js (Vitest) and Roblox (roblox-ts) by using insertion sort
 */
export function sortNodesDescending<T extends { distanceFromStart: number }>(nodes: T[]): T[] {
    const sorted = [...nodes];
    const len = sorted.size();
    for (let i = 1; i < len; i++) {
        let j = i;
        while (j > 0 && sorted[j - 1].distanceFromStart < sorted[j].distanceFromStart) {
            const temp = sorted[j];
            sorted[j] = sorted[j - 1];
            sorted[j - 1] = temp;
            j--;
        }
    }
    return sorted;
}

/**
 * Helper to get Set size in both Lua (method) and JS (property) environments
 */
export function getSetSize(s: unknown): number {
    // Structural interfaces for detection
    interface SetWithSizeMethod { size(): number }
    interface SetWithSizeProp { size: number }

    // Check if 'size' is a function (Roblox/Lua)
    const maybeMethod = s as SetWithSizeMethod;
    if (typeIs(maybeMethod.size, "function")) {
        return maybeMethod.size();
    }

    // Fallback to property (Node/JS)
    return (s as SetWithSizeProp).size;
}
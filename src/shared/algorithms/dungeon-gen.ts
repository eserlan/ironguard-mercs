import { TileAsset, Connector, ConnectorDirection } from "../domain/TileDefs";
import { RNG } from "./rng";
import { Vec3 } from "../domain/world";
import { findValidPlacements, TilePlacement, GlobalConnector } from "./connector-logic";

export interface GraphNode {
    id: string;
    tileId: string;
    position: Vec3;
    rotation: number;
    bounds: { min: Vec3, max: Vec3 };
}

export function generateGraph(seed: number, tileset: TileAsset[], targetSize = 10): GraphNode[] {
    const rng = new RNG(seed);
    const nodes: GraphNode[] = [];
    const openConnectors: GlobalConnector[] = [];
    
    if (tileset.size() === 0) return [];

    // 1. Place Root
    const rootTile = tileset[0]; // Assume first is start
    const rootPos = { x: 0, y: 0, z: 0 };
    const rootBounds = calculateBounds(rootPos, rootTile.size, 0);
    
    nodes.push({
        id: "Root",
        tileId: rootTile.id,
        position: rootPos,
        rotation: 0,
        bounds: rootBounds
    });

    // Add root connectors
    addConnectors(openConnectors, rootTile, rootPos, 0);

    // 2. Growth Loop
    let attempts = 0;
    while (nodes.size() < targetSize && attempts < 100 && openConnectors.size() > 0) {
        attempts++;
        
        // Pick random open connector
        const connIdx = rng.range(0, openConnectors.size() - 1);
        const sourceConn = openConnectors[connIdx];
        
        // Pick random tile
        const candidateTile = tileset[rng.range(0, tileset.size() - 1)];
        
        // Find valid placements
        const placements = findValidPlacements(sourceConn, candidateTile);
        
        if (placements.size() > 0) {
            const pick = placements[rng.range(0, placements.size() - 1)];
            
            // Collision Check
            const newBounds = calculateBounds(pick.position, candidateTile.size, pick.rotation);
            if (!checkCollision(newBounds, nodes)) {
                // Success!
                nodes.push({
                    id: `Node_${nodes.size()}`,
                    tileId: pick.tileId,
                    position: pick.position,
                    rotation: pick.rotation,
                    bounds: newBounds
                });
                
                // Remove used connector
                // (In a real graph, we mark it connected, but here we just remove from open set)
                openConnectors.remove(connIdx);
                
                // Add new connectors
                addConnectors(openConnectors, candidateTile, pick.position, pick.rotation);
            }
        }
    }
    
    return nodes;
}

function calculateBounds(pos: Vec3, size: Vec3, rot: number) {
    // Rotation affects size dimensions
    let sx = size.x;
    let sz = size.z;
    
    if (rot === 1 || rot === 3) { // 90 or 270
        sx = size.z;
        sz = size.x;
    }
    
    // Assume pos is center? Or corner?
    // Let's assume pos is Center of floor.
    const halfX = sx / 2;
    const halfZ = sz / 2;
    
    return {
        min: { x: pos.x - halfX + 0.1, y: 0, z: pos.z - halfZ + 0.1 }, // Epsilon shrinking
        max: { x: pos.x + halfX - 0.1, y: size.y, z: pos.z + halfZ - 0.1 }
    };
}

function checkCollision(bounds: { min: Vec3, max: Vec3 }, nodes: GraphNode[]): boolean {
    for (const node of nodes) {
        if (aabbOverlap(bounds, node.bounds)) return true;
    }
    return false;
}

function aabbOverlap(b1: { min: Vec3, max: Vec3 }, b2: { min: Vec3, max: Vec3 }): boolean {
    return (b1.min.x < b2.max.x && b1.max.x > b2.min.x) &&
           (b1.min.z < b2.max.z && b1.max.z > b2.min.z);
}

function addConnectors(list: GlobalConnector[], tile: TileAsset, pos: Vec3, rot: number) {
    for (const c of tile.connectors) {
        // Calculate global pos/dir
        // Reuse logic from connector-logic.ts? 
        // We need to export rotate functions or duplicate.
        // For now, duplicate simple rotation logic.
        
        const rDir = rotateDirection(c.direction, rot);
        const rOffset = rotateVec3(c.localPosition, rot);
        
        list.push({
            position: { x: pos.x + rOffset.x, y: pos.y + rOffset.y, z: pos.z + rOffset.z },
            direction: rDir,
            type: c.type
        });
    }
}

// Duplicated from connector-logic for now (should extract to utils)
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
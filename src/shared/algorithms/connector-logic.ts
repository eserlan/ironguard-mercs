import { TileAsset, Connector, ConnectorDirection } from "../domain/TileDefs";
import { Vec3 } from "../domain/world";

export interface TilePlacement {
    tileId: string;
    position: Vec3;
    rotation: number; // 0=0, 1=90, 2=180, 3=270 (Degrees Clockwise)
    connectedVia: number; // Index of the connector on the new tile used for connection
}

export interface GlobalConnector {
    position: Vec3;
    direction: ConnectorDirection;
    type: string;
}

export function findValidPlacements(
    source: GlobalConnector,
    candidate: TileAsset
): TilePlacement[] {
    const valid: TilePlacement[] = [];

    for (let i = 0; i < candidate.connectors.size(); i++) {
        const targetConn = candidate.connectors[i];
        
        // 1. Type Match
        if (targetConn.type !== source.type) continue;

        // 2. Try all 4 rotations
        for (let rot = 0; rot < 4; rot++) {
            const rotatedDir = rotateDirection(targetConn.direction, rot);
            
            // 3. Direction Match (Must be opposite)
            if (isOpposite(source.direction, rotatedDir)) {
                // 4. Calculate Position
                // We want: SourceGlobalPos = NewTilePos + RotatedLocalConnPos
                // So: NewTilePos = SourceGlobalPos - RotatedLocalConnPos
                
                const rotatedOffset = rotateVec3(targetConn.localPosition, rot);
                const tilePos = {
                    x: source.position.x - rotatedOffset.x,
                    y: source.position.y - rotatedOffset.y, // Usually 0
                    z: source.position.z - rotatedOffset.z
                };

                valid.push({
                    tileId: candidate.id,
                    position: tilePos,
                    rotation: rot,
                    connectedVia: i
                });
            }
        }
    }

    return valid;
}

function rotateDirection(dir: ConnectorDirection, rotations: number): ConnectorDirection {
    const dirs = [
        ConnectorDirection.North, 
        ConnectorDirection.East, 
        ConnectorDirection.South, 
        ConnectorDirection.West
    ];
    const idx = dirs.indexOf(dir);
    // Clockwise rotation
    return dirs[(idx + rotations) % 4];
}

function isOpposite(d1: ConnectorDirection, d2: ConnectorDirection): boolean {
    if (d1 === ConnectorDirection.North && d2 === ConnectorDirection.South) return true;
    if (d1 === ConnectorDirection.South && d2 === ConnectorDirection.North) return true;
    if (d1 === ConnectorDirection.East && d2 === ConnectorDirection.West) return true;
    if (d1 === ConnectorDirection.West && d2 === ConnectorDirection.East) return true;
    return false;
}

function rotateVec3(v: Vec3, rotations: number): Vec3 {
    let x = v.x;
    let z = v.z;
    
    for (let i = 0; i < rotations; i++) {
        // Rotate 90 degrees clockwise: (x, z) -> (z, -x)
        // Wait, standard math: (x, y) -> (y, -x) for -90 deg?
        // Let's assume North is -Z. East is +X.
        // North(0, -1) -> East(1, 0).
        // If x=0, z=-1. New x=1, z=0.
        // Formula: newX = -z, newZ = x?
        // Let's test: 0, -1 -> 1, 0 (East). Correct.
        // 1, 0 -> 0, 1 (South). Correct.
        // 0, 1 -> -1, 0 (West). Correct.
        // -1, 0 -> 0, -1 (North). Correct.
        
        const oldX = x;
        x = -z;
        z = oldX;
    }

    return { x, y: v.y, z };
}
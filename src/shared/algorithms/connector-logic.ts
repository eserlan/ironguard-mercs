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

/**
 * Rotates a 3D vector around the Y-axis by the specified number of 90-degree clockwise rotations.
 * 
 * This uses the rotation formula: (x, z) -> (-z, x) for each 90-degree clockwise rotation when
 * viewed from above (looking down the Y-axis), where North is -Z and East is +X.
 * 
 * @param v - The 3D vector to rotate (x, y, z coordinates)
 * @param rotations - Number of 90-degree clockwise rotations to apply (0-3)
 * @returns A new vector with rotated x and z coordinates, y coordinate unchanged
 */
function rotateVec3(v: Vec3, rotations: number): Vec3 {
    let x = v.x;
    let z = v.z;
    
    for (let i = 0; i < rotations; i++) {
        // Rotate 90 degrees clockwise: (x, z) -> (-z, x)
        const oldX = x;
        x = -z;
        z = oldX;
    }

    return { x, y: v.y, z };
}
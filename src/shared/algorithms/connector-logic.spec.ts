import { describe, it, expect } from "vitest";
import { findValidPlacements, GlobalConnector } from "./connector-logic";
import { TileAsset, ConnectorDirection } from "../domain/TileDefs";

describe("findValidPlacements", () => {
    const tile: TileAsset = {
        id: "Corridor",
        size: { x: 1, y: 1, z: 1 },
        tags: [],
        connectors: [
            { // Conn 0: North side, pointing North
                direction: ConnectorDirection.North,
                type: "Door",
                localPosition: { x: 0, y: 0, z: -2 } 
            },
            { // Conn 1: East side, pointing East
                direction: ConnectorDirection.East,
                type: "Door",
                localPosition: { x: 2, y: 0, z: 0 }
            }
        ]
    };

    it("matches opposite connectors without rotation", () => {
        const source: GlobalConnector = {
            position: { x: 0, y: 0, z: 0 },
            direction: ConnectorDirection.South, // Points South (needs North)
            type: "Door"
        };
        
        const results = findValidPlacements(source, tile);
        const match = results.find(r => r.connectedVia === 0 && r.rotation === 0);
        
        expect(match).toBeDefined();
        // Source at 0,0,0. Target local at 0,0,-2.
        // Tile = Source - Local = 0 - (-2) = +2
        expect(match?.position.z).toBe(2);
    });

    it("matches with 90 degree rotation", () => {
        const source: GlobalConnector = {
            position: { x: 10, y: 0, z: 10 },
            direction: ConnectorDirection.West, // Points West (needs East)
            type: "Door"
        };
        
        // Tile Conn 0 points North.
        // Rotate 1 (90 deg) -> Points East. This is opposite of West. Match!
        
        const results = findValidPlacements(source, tile);
        const match = results.find(r => r.connectedVia === 0 && r.rotation === 1);
        
        expect(match).toBeDefined();
        
        // Check position logic
        // Local pos (0,0,-2) rotated 90 deg:
        // x = -z = -(-2) = 2
        // z = oldX = 0
        // Rotated Offset = (2, 0, 0)
        // Tile Pos = Source(10,0,10) - Offset(2,0,0) = (8, 0, 10)
        expect(match?.position.x).toBe(8);
        expect(match?.position.z).toBe(10);
    });
    
    it("filters by type", () => {
        const source: GlobalConnector = {
            position: { x: 0, y: 0, z: 0 },
            direction: ConnectorDirection.South,
            type: "Archway" // Mismatch
        };
        
        const results = findValidPlacements(source, tile);
        expect(results.length).toBe(0);
    });
});

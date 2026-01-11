import { describe, it, expect } from 'vitest';
import { generateGraph } from './dungeon-gen';
import { TileAsset, ConnectorDirection } from '../domain/TileDefs';

const MOCK_TILESET: TileAsset[] = [
    {
        id: "Room_Start",
        size: {x: 4, y: 1, z: 4},
        tags: [],
        connectors: [
             { direction: ConnectorDirection.North, type: "Door", localPosition: {x:0, y:0, z:-2} }
        ]
    },
    {
        id: "Corridor",
        size: {x: 4, y: 1, z: 4}, // 4x4
        tags: [],
        connectors: [
             { direction: ConnectorDirection.South, type: "Door", localPosition: {x:0, y:0, z:2} },
             { direction: ConnectorDirection.North, type: "Door", localPosition: {x:0, y:0, z:-2} }
        ]
    }
];

describe('generateGraph', () => {
    it('is deterministic', () => {
        const g1 = generateGraph(123, MOCK_TILESET, 5);
        const g2 = generateGraph(123, MOCK_TILESET, 5);
        expect(g1).toEqual(g2);
    });

    it('grows beyond root', () => {
        const g = generateGraph(456, MOCK_TILESET, 5);
        // Expect Root + at least 1 Corridor
        expect(g.length).toBeGreaterThan(1);
        
        // Check structure
        expect(g[0].id).toBe("Root");
    });
});
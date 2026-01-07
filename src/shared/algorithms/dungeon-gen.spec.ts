import { describe, it, expect } from 'vitest';
import { generateGraph } from './dungeon-gen';
import { TileAsset } from '../domain/TileDefs';

const MOCK_TILESET: TileAsset[] = [
    {
        id: "Room_A",
        size: {x: 4, y: 1, z: 4},
        connectors: [],
        tags: []
    }
];

describe('generateGraph', () => {
    it('is deterministic', () => {
        const g1 = generateGraph(123, MOCK_TILESET);
        const g2 = generateGraph(123, MOCK_TILESET);
        expect(g1).toEqual(g2);
    });

    it('generates nodes', () => {
        const g = generateGraph(123, MOCK_TILESET);
        expect(g.size()).toBeGreaterThan(1);
    });
});

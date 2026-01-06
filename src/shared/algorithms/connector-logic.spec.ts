import { describe, it, expect } from 'vitest';
import { findMatchingConnector } from './connector-logic';
import { ConnectorDirection, TileAsset } from '../domain/TileDefs';

describe('findMatchingConnector', () => {
    it('finds opposite', () => {
        const source = { direction: ConnectorDirection.North, type: 'Door', localPosition: {x:0, y:0, z:0} };
        const target: TileAsset = {
            id: 't1', size: {x:1, y:1, z:1}, tags: [],
            connectors: [{ direction: ConnectorDirection.South, type: 'Door', localPosition: {x:0, y:0, z:0} }]
        };
        
        const match = findMatchingConnector(source, target);
        expect(match).toBeDefined();
        expect(match?.direction).toBe(ConnectorDirection.South);
    });
});

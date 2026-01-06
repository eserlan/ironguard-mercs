import { describe, it, expect } from 'vitest';
import { findMatchingConnector } from './connector-logic';
import { ConnectorDirection, TileAsset } from '../domain/TileDefs';

describe('findMatchingConnector', () => {
    it('finds North-South opposite', () => {
        const source = { direction: ConnectorDirection.North, type: 'Door', localPosition: {x:0, y:0, z:0} };
        const target: TileAsset = {
            id: 't1', size: {x:1, y:1, z:1}, tags: [],
            connectors: [{ direction: ConnectorDirection.South, type: 'Door', localPosition: {x:0, y:0, z:0} }]
        };
        
        const match = findMatchingConnector(source, target);
        expect(match).toBeDefined();
        expect(match?.direction).toBe(ConnectorDirection.South);
    });

    it('finds South-North opposite', () => {
        const source = { direction: ConnectorDirection.South, type: 'Door', localPosition: {x:0, y:0, z:0} };
        const target: TileAsset = {
            id: 't1', size: {x:1, y:1, z:1}, tags: [],
            connectors: [{ direction: ConnectorDirection.North, type: 'Door', localPosition: {x:0, y:0, z:0} }]
        };
        const match = findMatchingConnector(source, target);
        expect(match?.direction).toBe(ConnectorDirection.North);
    });

    it('finds East-West opposite', () => {
        const source = { direction: ConnectorDirection.East, type: 'Door', localPosition: {x:0, y:0, z:0} };
        const target: TileAsset = {
            id: 't1', size: {x:1, y:1, z:1}, tags: [],
            connectors: [{ direction: ConnectorDirection.West, type: 'Door', localPosition: {x:0, y:0, z:0} }]
        };
        const match = findMatchingConnector(source, target);
        expect(match?.direction).toBe(ConnectorDirection.West);
    });

    it('finds West-East opposite', () => {
        const source = { direction: ConnectorDirection.West, type: 'Door', localPosition: {x:0, y:0, z:0} };
        const target: TileAsset = {
            id: 't1', size: {x:1, y:1, z:1}, tags: [],
            connectors: [{ direction: ConnectorDirection.East, type: 'Door', localPosition: {x:0, y:0, z:0} }]
        };
        const match = findMatchingConnector(source, target);
        expect(match?.direction).toBe(ConnectorDirection.East);
    });

    it('returns undefined when no opposite found', () => {
        const source = { direction: ConnectorDirection.North, type: 'Door', localPosition: {x:0, y:0, z:0} };
        const target: TileAsset = {
            id: 't1', size: {x:1, y:1, z:1}, tags: [],
            connectors: [{ direction: ConnectorDirection.East, type: 'Door', localPosition: {x:0, y:0, z:0} }]
        };
        const match = findMatchingConnector(source, target);
        expect(match).toBeUndefined();
    });
});
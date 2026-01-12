import { describe, it, expect } from "vitest";
import { generateDungeonGraph, DungeonGraph, GraphNode } from "./dungeon-gen";
import { TileRegistry } from "../domain/dungeon/TileRegistry";
import { initializeTileRegistry } from "../domain/dungeon/manifest";
import { ConnectorDirection } from "../domain/TileDefs";

// Helper to simulate DungeonService.rotateDirection
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

describe("Dungeon Integration Logic", () => {
    initializeTileRegistry();
    const tileset = TileRegistry.getAll();

    it("should ensure every graph edge corresponds to a 'used' connector on the node", () => {
        // Test multiple seeds to catch edge cases
        const seeds = [1, 123, 456, 789, 9999, 54321];

        for (const seed of seeds) {
            const graph = generateDungeonGraph(seed, tileset, { minPathLength: 8, maxBranches: 2 });

            // Check every single edge in the graph
            for (const edge of graph.edges) {
                const fromNode = graph.nodes.find(n => n.id === edge.from);
                const toNode = graph.nodes.find(n => n.id === edge.to);

                expect(fromNode).toBeDefined();
                expect(toNode).toBeDefined();

                if (!fromNode || !toNode) continue;

                // 1. Verify FROM node has the exit marked as used
                // The edge store 'fromDirection' relative to the tile's original orientation?
                // OR relative to the placed node?
                // Let's check dungeon-gen.ts: 
                //    fromDirection: sourceConn.direction 
                // sourceConn comes from frontierConnectors which has 'direction: rDir' (rotated direction)
                // So edge.fromDirection is ALREADY rotated to world space (relative to the node's rotation? No, it's just the direction).

                // Wait, let's look at dungeon-gen.ts lines 103:
                // const rDir = rotateDirection(chosenConnector.direction, 0); 
                // frontierConnectors store 'direction' as the ROTATED direction.

                // And lines 194:
                // sourceNode.usedConnectorDirections.push(sourceConn.direction);

                // And lines 201:
                // fromDirection: sourceConn.direction

                // So edge.fromDirection SHOULD be exactly what is in usedConnectorDirections.

                const fromIsUsed = fromNode.usedConnectorDirections.includes(edge.fromDirection);
                if (!fromIsUsed) {
                    console.error(`Edge ${edge.from} -> ${edge.to} uses direction ${edge.fromDirection}, but node ${edge.from} only has [${fromNode.usedConnectorDirections.join(", ")}]`);
                }
                expect(fromIsUsed, `Seed ${seed}: Node ${fromNode.id} should have marked direction ${edge.fromDirection} as used`).toBe(true);

                // 2. Verify TO node has the entry marked as used
                // edge.toDirection is calculated as:
                // const usedDirOnNewTile = rotateDirection(usedConnector.direction, pick.rotation);
                // toDirection: usedDirOnNewTile

                // And newNode.usedConnectorDirections: [usedDirOnNewTile] (initially)

                const toIsUsed = toNode.usedConnectorDirections.includes(edge.toDirection);
                if (!toIsUsed) {
                    console.error(`Edge ${edge.from} -> ${edge.to} connects to ${edge.toDirection}, but node ${edge.to} only has [${toNode.usedConnectorDirections.join(", ")}]`);
                }
                expect(toIsUsed, `Seed ${seed}: Node ${toNode.id} should have marked direction ${edge.toDirection} as used`).toBe(true);
            }
        }
    });

    it("should ensure every 'used' connector has a corresponding edge (except Start/End/Leafs?)", () => {
        // This is less critical for "path blocked" but good for "wall missing"
        // Logic: If a connector is "used", there MUST be an edge connected to it.
        // Or it must be the "open" side of a Start/End if we treat them specially (we don't really, they just have 1 connection).

        const seeds = [1, 42];
        for (const seed of seeds) {
            const graph = generateDungeonGraph(seed, tileset);

            for (const node of graph.nodes) {
                for (const usedDir of node.usedConnectorDirections) {
                    // There must be an edge connected to this node with this direction
                    const hasEdge = graph.edges.some(e =>
                        (e.from === node.id && e.fromDirection === usedDir) ||
                        (e.to === node.id && e.toDirection === usedDir)
                    );

                    if (!hasEdge) {
                        // Is it a bug? 
                        // Check raw log to see if maybe there's a disconnect
                        console.warn(`Seed ${seed}: Node ${node.id} has used direction ${usedDir} but no matching edge found.`);
                    }
                    expect(hasEdge, `Seed ${seed}: Node ${node.id} marks ${usedDir} as used but has no edge for it`).toBe(true);
                }
            }
        }
    });

    it("should emulate DungeonService Check for all nodes on main path", () => {
        // This emulates the exact check DungeonService does:
        // for (const dir of allDirections) { if (used) open else block }
        // We want to verify that for every connection between A and B, 
        // A's 'dir' is USED (open) and B's 'dir' is USED (open).

        const seeds = [555, 777];
        for (const seed of seeds) {
            const graph = generateDungeonGraph(seed, tileset, { minPathLength: 6 });
            const mainPath = graph.nodes.filter(n => n.tags.includes("MainPath"));

            // Sort by distance
            const sorted = mainPath.sort((a, b) => a.distanceFromStart - b.distanceFromStart);

            for (let i = 0; i < sorted.length - 1; i++) {
                const curr = sorted[i];
                const next = sorted[i + 1];

                // Find the edge connecting them
                const edge = graph.edges.find(e =>
                    (e.from === curr.id && e.to === next.id) ||
                    (e.from === next.id && e.to === curr.id)
                );

                expect(edge, `Main path ${curr.id} -> ${next.id} must be connected`).toBeDefined();
                if (!edge) continue;

                // Verify "Passability"
                // Emulate DungeonService logic for CURR (Source)
                // curr needs to have edge.fromDirection (or toDirection if reversed) in used list

                let dirFromCurrToNext: ConnectorDirection;
                let dirFromNextToCurr: ConnectorDirection;

                if (edge.from === curr.id) {
                    dirFromCurrToNext = edge.fromDirection;
                    dirFromNextToCurr = edge.toDirection;
                } else {
                    dirFromCurrToNext = edge.toDirection;
                    dirFromNextToCurr = edge.fromDirection;
                }

                const currIsOpen = curr.usedConnectorDirections.includes(dirFromCurrToNext);
                const nextIsOpen = next.usedConnectorDirections.includes(dirFromNextToCurr);

                expect(currIsOpen, `Path Blocked at ${curr.id} exiting ${dirFromCurrToNext}`).toBe(true);
                expect(nextIsOpen, `Path Blocked at ${next.id} entering ${dirFromNextToCurr}`).toBe(true);
            }
        }
    });
});

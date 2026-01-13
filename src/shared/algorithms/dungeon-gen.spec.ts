import { describe, it, expect } from "vitest";
import {
    generateGraph,
    generateDungeonGraph,
    validateDungeon,
    findAllPaths,
    countRoutes,
    getShortestPathLength,
    getMainPathNodes,
    getSetSize
} from "./dungeon-gen";

import { TileRegistry } from "../domain/dungeon/TileRegistry";
import { initializeTileRegistry } from "../domain/dungeon/manifest";

describe("Dungeon Generation Algorithm", () => {
    // Initialize tileset once
    initializeTileRegistry();
    const tileset = TileRegistry.getAll();

    describe("Linear Path Generation", () => {
        it("should generate a main path of at least minPathLength rooms", () => {
            const minPathLength = 8;
            const graph = generateDungeonGraph(12345, tileset, { minPathLength });

            const mainPath = getMainPathNodes(graph);
            console.log(`Main path length: ${mainPath.length} (target: ${minPathLength})`);
            console.log(`Main path: ${mainPath.map(n => n.id).join(" -> ")}`);

            expect(mainPath.length).toBeGreaterThanOrEqual(minPathLength);
        });

        it("should have Start and BossRoom on the main path", () => {
            const graph = generateDungeonGraph(42, tileset, { minPathLength: 6 });

            const mainPath = getMainPathNodes(graph);
            const mainPathIds = mainPath.map(n => n.id);

            expect(mainPathIds).toContain("Start");
            expect(mainPathIds).toContain("BossRoom");
        });

        it("should have main path nodes with increasing distanceFromStart", () => {
            const graph = generateDungeonGraph(999, tileset, { minPathLength: 6 });

            const mainPath = getMainPathNodes(graph);

            // Sort by distance and verify monotonic increase
            const sorted = [...mainPath].sort((a, b) => a.distanceFromStart - b.distanceFromStart);

            for (let i = 1; i < sorted.length; i++) {
                expect(sorted[i].distanceFromStart).toBeGreaterThan(sorted[i - 1].distanceFromStart);
            }

            console.log(`Path distances: ${sorted.map(n => `${n.id}(${n.distanceFromStart})`).join(" -> ")}`);
        });

        it("should have shortest path equal to main path length", () => {
            const minPathLength = 7;
            const graph = generateDungeonGraph(777, tileset, { minPathLength, maxBranches: 0 });

            const shortestPath = getShortestPathLength(graph);
            const mainPathLength = graph.mainPathLength;

            console.log(`Shortest path: ${shortestPath}, Main path: ${mainPathLength}`);

            // Shortest path should be exactly the main path
            expect(shortestPath).toBe(mainPathLength);
        });
    });

    describe("Branch Control", () => {
        it("should generate no branches when maxBranches is 0", () => {
            const graph = generateDungeonGraph(123, tileset, { minPathLength: 6, maxBranches: 0 });

            const branchNodes = graph.nodes.filter(n => n.tags.includes("Branch"));
            console.log(`Branches: ${branchNodes.length} (max: 0)`);

            expect(branchNodes.length).toBe(0);
        });

        it("should limit branches to maxBranches", () => {
            const maxBranches = 2;
            const graph = generateDungeonGraph(456, tileset, { minPathLength: 5, maxBranches });

            const branchNodes = graph.nodes.filter(n => n.tags.includes("Branch"));
            console.log(`Branches: ${branchNodes.length} (max: ${maxBranches})`);

            expect(branchNodes.length).toBeLessThanOrEqual(maxBranches);
        });

        it("should have all nodes either on MainPath or Branch", () => {
            const graph = generateDungeonGraph(888, tileset, { minPathLength: 6, maxBranches: 3 });

            for (const node of graph.nodes) {
                const isMainPath = node.tags.includes("MainPath");
                const isBranch = node.tags.includes("Branch");

                expect(isMainPath || isBranch).toBe(true);
            }
        });
    });

    describe("Room Pacing", () => {
        // Helper to classify tiles as corridor (2 connectors) or room (3+ connectors)
        function getTileType(tileId: string): "corridor" | "room" | "unknown" {
            const tile = tileset.find(t => t.id === tileId);
            if (!tile) return "unknown";
            return tile.connectors.length === 2 ? "corridor" : "room";
        }

        it("should always place BossRoom at the end of the main path (highest distance)", () => {
            const testSeeds = [1, 42, 100, 255, 500, 777, 999, 1234, 5678, 9999];

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, { minPathLength: 8, maxBranches: 0 });

                if (!graph.endNodeId) {
                    console.log(`Seed ${seed}: No boss room placed`);
                    continue;
                }

                const mainPath = getMainPathNodes(graph);
                const bossNode = mainPath.find(n => n.id === "BossRoom");

                if (!bossNode) {
                    console.log(`Seed ${seed}: BossRoom not in main path`);
                    continue;
                }

                // Find max distance among all main path nodes
                let maxDistance = 0;
                for (const node of mainPath) {
                    if (node.distanceFromStart > maxDistance) {
                        maxDistance = node.distanceFromStart;
                    }
                }

                console.log(`Seed ${seed}: BossRoom distance=${bossNode.distanceFromStart}, maxDistance=${maxDistance}`);

                // BossRoom should be at or near the maximum distance
                expect(bossNode.distanceFromStart).toBe(maxDistance);
            }
        });

        it("should never have more than 3 consecutive corridors on main path", () => {
            const testSeeds = [1, 42, 100, 255, 500, 777, 999, 1234, 5678, 9999];

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, { minPathLength: 10, maxBranches: 0 });
                const mainPath = getMainPathNodes(graph);
                const sorted = [...mainPath].sort((a, b) => a.distanceFromStart - b.distanceFromStart);

                let consecutiveCorridors = 0;
                let maxConsecutive = 0;

                for (const node of sorted) {
                    const tileType = getTileType(node.tileId);
                    if (tileType === "corridor") {
                        consecutiveCorridors++;
                        maxConsecutive = Math.max(maxConsecutive, consecutiveCorridors);
                    } else {
                        consecutiveCorridors = 0;
                    }
                }

                const pathTypes = sorted.map(n => {
                    const t = getTileType(n.tileId);
                    return t === "corridor" ? "C" : "R";
                }).join("");

                console.log(`Seed ${seed}: ${pathTypes} (max consecutive corridors: ${maxConsecutive})`);

                // Should never exceed 3 consecutive corridors (pacing limit is 1-3)
                expect(maxConsecutive).toBeLessThanOrEqual(3);
            }
        });

        it("should have a mix of corridors and rooms on long paths", () => {
            const graph = generateDungeonGraph(12345, tileset, { minPathLength: 12, maxBranches: 0 });
            const mainPath = getMainPathNodes(graph);
            const sorted = [...mainPath].sort((a, b) => a.distanceFromStart - b.distanceFromStart);

            let corridorCount = 0;
            let roomCount = 0;

            for (const node of sorted) {
                const tileType = getTileType(node.tileId);
                if (tileType === "corridor") {
                    corridorCount++;
                } else if (tileType === "room") {
                    roomCount++;
                }
            }

            const pathTypes = sorted.map(n => {
                const t = getTileType(n.tileId);
                return t === "corridor" ? "C" : "R";
            }).join("");

            console.log(`Path composition: ${pathTypes}`);
            console.log(`Corridors: ${corridorCount}, Rooms: ${roomCount}`);

            // For a path of 12+, we should have both corridors and rooms
            expect(corridorCount).toBeGreaterThan(0);
            expect(roomCount).toBeGreaterThan(0);

            // Rooms should be at least 1/4 of the path (pacing ensures room every 1-3 corridors)
            // With 12 tiles, minimum would be ~3 rooms if max corridors between each
            expect(roomCount).toBeGreaterThanOrEqual(2);
        });

        it("should show variety in pacing across different seeds", () => {
            const patterns: string[] = [];

            for (let seed = 1; seed <= 10; seed++) {
                const graph = generateDungeonGraph(seed * 111, tileset, { minPathLength: 8, maxBranches: 0 });
                const mainPath = getMainPathNodes(graph);
                const sorted = [...mainPath].sort((a, b) => a.distanceFromStart - b.distanceFromStart);

                const pattern = sorted.map(n => {
                    const t = getTileType(n.tileId);
                    return t === "corridor" ? "C" : "R";
                }).join("");

                patterns.push(pattern);
            }

            console.log("Pacing patterns across seeds:");
            patterns.forEach((p, i) => console.log(`  Seed ${(i + 1) * 111}: ${p}`));

            // Check that not all patterns are identical (randomness in pacing)
            const uniquePatterns = new Set(patterns);
            console.log(`Unique patterns: ${getSetSize(uniquePatterns)}/${patterns.length}`);

            // We should see some variety (at least 2 different patterns out of 10)
            expect(getSetSize(uniquePatterns)).toBeGreaterThanOrEqual(2);
        });
    });

    describe("Path Validation", () => {
        it("should always have exactly one route from Start to Boss when no branches", () => {
            const graph = generateDungeonGraph(111, tileset, { minPathLength: 6, maxBranches: 0 });

            const routes = countRoutes(graph);
            console.log(`Routes to boss: ${routes}`);

            expect(routes).toBe(1);
        });

        it("should validate successfully for well-formed dungeon", () => {
            const graph = generateDungeonGraph(222, tileset, { minPathLength: 5 });

            const result = validateDungeon(graph);
            console.log(`Validation: ${result.valid ? "PASSED" : result.reason}`);

            expect(result.valid).toBe(true);
        });

        it("should have BossRoom at the end of the path", () => {
            const graph = generateDungeonGraph(333, tileset, { minPathLength: 6 });

            const paths = findAllPaths(graph, 1);
            expect(paths.length).toBeGreaterThan(0);

            const path = paths[0];
            expect(path[path.length - 1]).toBe("BossRoom");
            expect(path[0]).toBe("Start");

            console.log(`Path: ${path.join(" -> ")}`);
        });
    });

    describe("Deterministic Generation", () => {
        it("should produce identical results for the same seed", () => {
            const seed = 12345;
            const config = { minPathLength: 6, maxBranches: 2 };

            const graph1 = generateDungeonGraph(seed, tileset, config);
            const graph2 = generateDungeonGraph(seed, tileset, config);

            expect(graph1.nodes.length).toBe(graph2.nodes.length);
            expect(graph1.edges.length).toBe(graph2.edges.length);
            expect(graph1.mainPathLength).toBe(graph2.mainPathLength);
        });

        it("should produce different results for different seeds", () => {
            const config = { minPathLength: 6 };
            const graph1 = generateDungeonGraph(111, tileset, config);
            const graph2 = generateDungeonGraph(222, tileset, config);

            // Layouts should differ
            let different = false;
            for (let i = 1; i < Math.min(graph1.nodes.length, graph2.nodes.length); i++) {
                if (graph1.nodes[i].position.x !== graph2.nodes[i].position.x) {
                    different = true;
                    break;
                }
            }
            expect(different).toBe(true);
        });
    });

    describe("Generation Statistics", () => {
        it("should consistently generate valid linear dungeons", () => {
            const stats = {
                validCount: 0,
                avgPathLength: 0,
                avgTotalNodes: 0,
                minPathLengths: [] as number[]
            };

            const testSeeds = [1, 42, 100, 255, 500, 777, 999, 1234, 5678, 9999];
            const config = { minPathLength: 8, maxBranches: 2 };

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, config);
                const validation = validateDungeon(graph);

                if (validation.valid) {
                    stats.validCount++;
                    stats.avgPathLength += graph.mainPathLength;
                    stats.avgTotalNodes += graph.nodes.length;
                    stats.minPathLengths.push(graph.mainPathLength);
                }
            }

            stats.avgPathLength /= stats.validCount;
            stats.avgTotalNodes /= stats.validCount;

            console.log("\n=== Linear Generation Statistics ===");
            console.log(`Seeds tested: ${testSeeds.length}`);
            console.log(`Valid dungeons: ${stats.validCount}/${testSeeds.length}`);
            console.log(`Avg main path length: ${stats.avgPathLength.toFixed(1)}`);
            console.log(`Avg total nodes: ${stats.avgTotalNodes.toFixed(1)}`);
            console.log(`Path lengths: ${stats.minPathLengths.join(", ")}`);

            // At least 80% should be valid (some seeds may fail due to collision constraints)
            expect(stats.validCount).toBeGreaterThanOrEqual(testSeeds.length * 0.8);
            // Average path should be close to minPathLength
            expect(stats.avgPathLength).toBeGreaterThanOrEqual(config.minPathLength);
        });
    });

    describe("Legacy Compatibility", () => {
        it("generateGraph should still work", () => {
            const nodes = generateGraph(555, tileset, 10);

            expect(nodes.length).toBeGreaterThan(0);
            expect(nodes[0].id).toBe("Start");
        });
    });

    describe("Path Connectivity and Door Openability", () => {
        it("should have edges connecting all adjacent main path nodes", () => {
            const testSeeds = [1, 42, 100, 777, 1234];

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, { minPathLength: 8, maxBranches: 0 });
                const mainPath = getMainPathNodes(graph);
                const sorted = [...mainPath].sort((a, b) => a.distanceFromStart - b.distanceFromStart);

                // Check that each consecutive pair has an edge
                for (let i = 0; i < sorted.length - 1; i++) {
                    const current = sorted[i];
                    const next = sorted[i + 1];

                    const hasEdge = graph.edges.some(e =>
                        (e.from === current.id && e.to === next.id) ||
                        (e.from === next.id && e.to === current.id)
                    );

                    if (!hasEdge) {
                        console.log(`Seed ${seed}: Missing edge between ${current.id} and ${next.id}`);
                    }
                    expect(hasEdge).toBe(true);
                }
            }
        });

        it("should mark used connector directions on both sides of each edge", () => {
            const testSeeds = [1, 42, 100, 777, 1234];

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, { minPathLength: 8, maxBranches: 0 });

                for (const edge of graph.edges) {
                    const fromNode = graph.nodes.find(n => n.id === edge.from);
                    const toNode = graph.nodes.find(n => n.id === edge.to);

                    expect(fromNode).toBeDefined();
                    expect(toNode).toBeDefined();

                    if (fromNode && toNode) {
                        // The fromDirection should be in fromNode's usedConnectorDirections
                        const fromHasDirection = fromNode.usedConnectorDirections.includes(edge.fromDirection);
                        // The toDirection should be in toNode's usedConnectorDirections
                        const toHasDirection = toNode.usedConnectorDirections.includes(edge.toDirection);

                        if (!fromHasDirection) {
                            console.log(`Seed ${seed}: ${fromNode.id} missing direction ${edge.fromDirection}`);
                            console.log(`  usedConnectorDirections: ${fromNode.usedConnectorDirections}`);
                        }
                        if (!toHasDirection) {
                            console.log(`Seed ${seed}: ${toNode.id} missing direction ${edge.toDirection}`);
                            console.log(`  usedConnectorDirections: ${toNode.usedConnectorDirections}`);
                        }

                        expect(fromHasDirection).toBe(true);
                        expect(toHasDirection).toBe(true);
                    }
                }
            }
        });

        it("should have rooms with doors on all used connectors (not walls)", () => {
            const testSeeds = [1, 42, 100, 255, 500, 777, 999, 1234];

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, { minPathLength: 8, maxBranches: 0 });
                const mainPath = getMainPathNodes(graph);

                for (const node of mainPath) {
                    const tile = tileset.find(t => t.id === node.tileId);
                    if (!tile) continue;

                    const isRoom = tile.connectors.length >= 3;

                    if (isRoom) {
                        // Rooms should have usedConnectorDirections for each connection
                        const usedCount = node.usedConnectorDirections.length;

                        // Find edges involving this node
                        const nodeEdges = graph.edges.filter(e => e.from === node.id || e.to === node.id);

                        if (usedCount !== nodeEdges.length) {
                            console.log(`Seed ${seed}: Room ${node.id} has ${usedCount} used directions but ${nodeEdges.length} edges`);
                            console.log(`  usedConnectorDirections: ${node.usedConnectorDirections}`);
                            console.log(`  edges: ${nodeEdges.map(e => `${e.from}->${e.to}`).join(", ")}`);
                        }

                        // Each edge should correspond to a used connector direction
                        expect(usedCount).toBe(nodeEdges.length);
                    }
                }
            }
        });

        it("should have Start room with exactly one used connector", () => {
            const testSeeds = [1, 42, 100, 255, 500, 777, 999, 1234, 5678, 9999];

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, { minPathLength: 6, maxBranches: 0 });
                const startNode = graph.nodes.find(n => n.id === "Start");

                expect(startNode).toBeDefined();
                if (startNode) {
                    const usedCount = startNode.usedConnectorDirections.length;
                    if (usedCount !== 1) {
                        console.log(`Seed ${seed}: Start has ${usedCount} used connectors (expected 1)`);
                        console.log(`  usedConnectorDirections: ${startNode.usedConnectorDirections}`);
                    }
                    expect(usedCount).toBe(1);
                }
            }
        });

        it("should have BossRoom with exactly one used connector (entrance only)", () => {
            const testSeeds = [1, 42, 100, 255, 500, 777, 999, 1234, 5678, 9999];

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, { minPathLength: 6, maxBranches: 0 });
                const bossNode = graph.nodes.find(n => n.id === "BossRoom");

                if (!bossNode) {
                    console.log(`Seed ${seed}: No BossRoom found`);
                    continue;
                }

                const usedCount = bossNode.usedConnectorDirections.length;
                if (usedCount !== 1) {
                    console.log(`Seed ${seed}: BossRoom has ${usedCount} used connectors (expected 1)`);
                    console.log(`  usedConnectorDirections: ${bossNode.usedConnectorDirections}`);
                }
                expect(usedCount).toBe(1);
            }
        });

        it("should have continuous path from Start to BossRoom via edges", () => {
            const testSeeds = [1, 42, 100, 255, 500, 777, 999, 1234];

            for (const seed of testSeeds) {
                const graph = generateDungeonGraph(seed, tileset, { minPathLength: 8, maxBranches: 0 });

                if (!graph.endNodeId) {
                    console.log(`Seed ${seed}: No end node`);
                    continue;
                }

                // BFS from Start to BossRoom
                const visited = new Set<string>();
                const queue: string[] = ["Start"];
                visited.add("Start");

                while (queue.length > 0) {
                    const current = queue.shift()!;

                    // Find all connected nodes via edges
                    for (const edge of graph.edges) {
                        let neighbor: string | undefined;
                        if (edge.from === current && !visited.has(edge.to)) {
                            neighbor = edge.to;
                        } else if (edge.to === current && !visited.has(edge.from)) {
                            neighbor = edge.from;
                        }

                        if (neighbor) {
                            visited.add(neighbor);
                            queue.push(neighbor);
                        }
                    }
                }

                const canReachBoss = visited.has("BossRoom");
                if (!canReachBoss) {
                    console.log(`Seed ${seed}: Cannot reach BossRoom from Start`);
                    console.log(`  Visited nodes: ${[...visited].join(", ")}`);
                }
                expect(canReachBoss).toBe(true);
            }
        });

        it("should log detailed path info for debugging", () => {
            const seed = 12345;
            const graph = generateDungeonGraph(seed, tileset, { minPathLength: 8, maxBranches: 0 });
            const mainPath = getMainPathNodes(graph);
            const sorted = [...mainPath].sort((a, b) => a.distanceFromStart - b.distanceFromStart);

            console.log("\n=== Detailed Path Info ===");
            console.log(`Seed: ${seed}`);
            console.log(`Total nodes: ${graph.nodes.length}, Edges: ${graph.edges.length}`);
            console.log(`Main path length: ${sorted.length}`);
            console.log("");

            for (const node of sorted) {
                const tile = tileset.find(t => t.id === node.tileId);
                const connectorCount = tile?.connectors.length ?? 0;
                const tileType = connectorCount === 2 ? "Corridor" : "Room";
                const nodeEdges = graph.edges.filter(e => e.from === node.id || e.to === node.id);

                console.log(`${node.id} (${node.tileId}, ${tileType}):`);
                console.log(`  Distance: ${node.distanceFromStart}`);
                console.log(`  Total connectors: ${connectorCount}`);
                console.log(`  Used directions: [${node.usedConnectorDirections.join(", ")}]`);
                console.log(`  Edges: ${nodeEdges.map(e => {
                    if (e.from === node.id) return `-> ${e.to} (${e.fromDirection})`;
                    return `<- ${e.from} (${e.toDirection})`;
                }).join(", ")}`);
            }

            expect(sorted.length).toBeGreaterThan(0);
        });
    });
});


import { TileRegistry } from "./TileRegistry";
import { ConnectorDirection } from "../../domain/TileDefs";

const TILES = [
    {
        id: "Room40x40",
        size: { x: 40, y: 20, z: 40 },
        tags: ["Start", "Room"],
        connectors: [
            { direction: ConnectorDirection.North, type: "Hall", localPosition: { x: 0, y: 0, z: -20 } },
            { direction: ConnectorDirection.South, type: "Hall", localPosition: { x: 0, y: 0, z: 20 } },
            { direction: ConnectorDirection.East, type: "Hall", localPosition: { x: 20, y: 0, z: 0 } },
            { direction: ConnectorDirection.West, type: "Hall", localPosition: { x: -20, y: 0, z: 0 } },
        ]
    },
    {
        id: "Hallway40",
        size: { x: 40, y: 20, z: 40 },
        tags: ["Hallway"],
        connectors: [
            { direction: ConnectorDirection.North, type: "Hall", localPosition: { x: 0, y: 0, z: -20 } },
            { direction: ConnectorDirection.South, type: "Hall", localPosition: { x: 0, y: 0, z: 20 } },
        ]
    },
    {
        id: "Crossroad40",
        size: { x: 40, y: 20, z: 40 },
        tags: ["Hallway"],
        connectors: [
            { direction: ConnectorDirection.North, type: "Hall", localPosition: { x: 0, y: 0, z: -20 } },
            { direction: ConnectorDirection.South, type: "Hall", localPosition: { x: 0, y: 0, z: 20 } },
            { direction: ConnectorDirection.East, type: "Hall", localPosition: { x: 20, y: 0, z: 0 } },
            { direction: ConnectorDirection.West, type: "Hall", localPosition: { x: -20, y: 0, z: 0 } },
        ]
    },
    {
        id: "EndRoom",
        size: { x: 40, y: 20, z: 40 },
        tags: ["End"],
        connectors: [
            { direction: ConnectorDirection.South, type: "Hall", localPosition: { x: 0, y: 0, z: 20 } },
        ]
    },
    {
        id: "LargeRoom60x60",
        size: { x: 60, y: 20, z: 60 },
        tags: ["Room"],
        connectors: [
            { direction: ConnectorDirection.North, type: "Hall", localPosition: { x: 0, y: 0, z: -30 } },
            { direction: ConnectorDirection.South, type: "Hall", localPosition: { x: 0, y: 0, z: 30 } },
            { direction: ConnectorDirection.East, type: "Hall", localPosition: { x: 30, y: 0, z: 0 } },
            { direction: ConnectorDirection.West, type: "Hall", localPosition: { x: -30, y: 0, z: 0 } },
        ]
    },
    // Narrow corridor - straight passage (narrower, 20 wide x 40 long)
    {
        id: "Corridor20x40",
        size: { x: 20, y: 20, z: 40 },
        tags: ["Corridor"],
        connectors: [
            { direction: ConnectorDirection.North, type: "Hall", localPosition: { x: 0, y: 0, z: -20 } },
            { direction: ConnectorDirection.South, type: "Hall", localPosition: { x: 0, y: 0, z: 20 } },
        ]
    },
    // L-shaped corner corridor (South + East openings)
    {
        id: "CornerCorridor20",
        size: { x: 20, y: 20, z: 20 },
        tags: ["Corridor", "Corner"],
        connectors: [
            { direction: ConnectorDirection.South, type: "Hall", localPosition: { x: 0, y: 0, z: 10 } },
            { direction: ConnectorDirection.East, type: "Hall", localPosition: { x: 10, y: 0, z: 0 } },
        ]
    }
];

export function initializeTileRegistry() {
    TILES.forEach((tile) => TileRegistry.register(tile));
}

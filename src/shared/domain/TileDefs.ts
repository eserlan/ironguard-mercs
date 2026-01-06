import { Vec3 } from "./world";

export enum ConnectorDirection {
    North = "North",
    East = "East",
    South = "South",
    West = "West"
}

export interface Connector {
    direction: ConnectorDirection;
    type: string; // "Hall", "Door"
    localPosition: Vec3; 
}

export interface TileAsset {
    id: string;
    size: Vec3; // in Grid Units (e.g. 4x4)
    connectors: Connector[];
    tags: string[];
}

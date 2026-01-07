import { TileAsset } from "../domain/TileDefs";
import { RNG } from "./rng";
import { Vec3 } from "../domain/world";

export interface GraphNode {
    id: string;
    tileId: string;
    position: Vec3;
}

export function generateGraph(seed: number, tileset: TileAsset[]): GraphNode[] {
    const rng = new RNG(seed);
    const nodes: GraphNode[] = [];
    
    if (tileset.size() === 0) return [];

    // 1. Place Start
    nodes.push({ id: "Root", tileId: tileset[0].id, position: {x:0, y:0, z:0} });
    
    // 2. Mock Growth: Place 3 more tiles in a line East
    let currentX = tileset[0].size.x;
    
    for (let i=0; i<3; i++) {
        // Use RNG to prove determinism
        const nextTile = tileset[rng.range(0, tileset.size() - 1)];
        nodes.push({
            id: `Node_${i}`,
            tileId: nextTile.id,
            position: {x: currentX, y: 0, z: 0}
        });
        currentX += nextTile.size.x;
    }
    
    return nodes;
}

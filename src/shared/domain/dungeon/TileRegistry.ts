import { TileAsset } from "../../domain/TileDefs";

export class TileRegistry {
    private static tiles = new Map<string, TileAsset>();

    public static register(tile: TileAsset) {
        if (this.tiles.has(tile.id)) {
            warn(`[TileRegistry] Duplicate tile ID: ${tile.id}`);
            return;
        }
        this.tiles.set(tile.id, tile);
    }

    public static get(id: string): TileAsset | undefined {
        return this.tiles.get(id);
    }

    public static getAll(): TileAsset[] {
        const list: TileAsset[] = [];
        this.tiles.forEach((t) => list.push(t));
        return list;
    }
}

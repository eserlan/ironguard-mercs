import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";
import { generateGraph, GraphNode } from "../../shared/algorithms/dungeon-gen";
import { TileAsset, Connector, ConnectorDirection } from "../../shared/domain/TileDefs";
import { ServerStorage, Workspace } from "@rbxts/services";

@Service({})
export class DungeonService implements OnStart {
    private tileAssets: TileAsset[] = [];
    private tileModels = new Map<string, Model>();
    private lastResult?: { playerSpawns: Vector3[], enemySpawns: Vector3[] };

    onStart() {
        this.loadTiles();
    }

    private loadTiles() {
        const folder = ServerStorage.FindFirstChild("Tiles");
        if (!folder) {
            Log.warn("ServerStorage/Tiles not found");
            return;
        }
        
        for (const child of folder.GetChildren()) {
            if (child.IsA("Model")) {
                const asset = this.parseTileModel(child);
                if (asset) {
                    this.tileAssets.push(asset);
                    this.tileModels.set(asset.id, child);
                }
            }
        }
        Log.info(`Loaded ${this.tileAssets.size()} tiles.`);
    }

    private parseTileModel(model: Model): TileAsset | undefined {
        const primary = model.PrimaryPart;
        if (!primary) {
            Log.warn(`Tile ${model.Name} has no PrimaryPart`);
            return undefined;
        }

        const size = model.GetExtentsSize();
        const connectors: Connector[] = [];
        
        for (const desc of model.GetDescendants()) {
            if (desc.IsA("Attachment") && desc.Name === "Connector") {
                const dirStr = desc.GetAttribute("Direction") as string;
                const connectorType = desc.GetAttribute("Type") as string || "Hall";
                
                // Validate Direction
                // In a real app, strict check. Here, loose cast.
                if (dirStr) {
                    connectors.push({
                        direction: dirStr as ConnectorDirection,
                        type: connectorType,
                        localPosition: {
                            x: desc.Position.X,
                            y: desc.Position.Y,
                            z: desc.Position.Z
                        }
                    });
                }
            }
        }

        const tagsAttribute = model.GetAttribute("Tags") as string;
        const tags = tagsAttribute ? tagsAttribute.split(",") : [];

        return {
            id: model.Name,
            size: { x: size.X, y: size.Y, z: size.Z },
            connectors: connectors,
            tags: tags
        };
    }

    public generate(seed: number) {
        Log.info(`[DungeonService] Generating dungeon with seed: ${seed}`);
        const graph = generateGraph(seed);
        Log.info(`[DungeonService] Graph generated with ${graph.nodes.size()} nodes`);

        const playerSpawns: Vector3[] = [];
        const enemySpawns: Vector3[] = [];

        // Simple placement for now: place tiles based on graph
        // This is a placeholder for a more complex layout algorithm
        let currentPos = new Vector3(0, 500, 0); // Elevation to avoid lobby

        graph.nodes.forEach((node, index) => {
            const assetStyle = index === 0 ? "Room40x40" : (index === graph.nodes.size() - 1 ? "EndRoom" : "Hallway40");
            const model = this.tileModels.get(assetStyle);

            if (model) {
                const clone = model.Clone();
                clone.Parent = Workspace;
                clone.PivotTo(new CFrame(currentPos));

                // Collect spawns
                for (const desc of clone.GetDescendants()) {
                    if (desc.IsA("BasePart")) {
                        if (desc.Name === "PlayerSpawn") playerSpawns.push(desc.Position);
                        if (desc.Name === "EnemySpawn") enemySpawns.push(desc.Position);
                    }
                }

                currentPos = currentPos.add(new Vector3(0, 0, 60)); // Simple linear layout for now
            }
        });

        Log.info(`[DungeonService] Generated ${playerSpawns.size()} player spawns and ${enemySpawns.size()} enemy spawns`);
        this.lastResult = { playerSpawns, enemySpawns };
        return this.lastResult;
    }

    private spawnNode(node: GraphNode, parent: Instance) {
        const modelTemplate = this.tileModels.get(node.tileId);
        if (!modelTemplate) return;

        const clone = modelTemplate.Clone();
        clone.Name = node.id;
        
        // Rotation: 0=0, 1=90 CW, 2=180, 3=270 CW
        // CFrame.Angles is radians. 90 deg = pi/2.
        // Negative for Clockwise around Y axis.
        const rotRad = -node.rotation * (math.pi / 2);
        
        const cf = new CFrame(node.position.x, node.position.y, node.position.z)
            .mul(CFrame.Angles(0, rotRad, 0));
        
        clone.SetPrimaryPartCFrame(cf);
        clone.Parent = parent;
        
        this.extractMetadata(clone);
    }

    private extractMetadata(model: Model) {
        for (const desc of model.GetDescendants()) {
            if (desc.IsA("BasePart")) {
                if (desc.Name === "EnemySpawn") {
                    this.lastResult?.enemySpawns.push(desc.Position);
                    desc.Transparency = 1;
                    desc.CanCollide = false;
                } else if (desc.Name === "PlayerSpawn") {
                    this.lastResult?.playerSpawns.push(desc.Position);
                    desc.Transparency = 1;
                    desc.CanCollide = false;
                }
            }
        }
    }
}
import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";
import { generateGraph, GraphNode } from "../../shared/algorithms/dungeon-gen";
import { TileAsset, Connector, ConnectorDirection } from "../../shared/domain/TileDefs";
import { ServerStorage, Workspace } from "@rbxts/services";

@Service({})
export class DungeonService implements OnStart {
    private tileAssets: TileAsset[] = [];
    private tileModels = new Map<string, Model>();

    onStart() {
        this.loadTiles();
        // Auto-generate for testing
        task.delay(5, () => {
            this.generate(math.random(1, 1000000));
        });
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
        Log.info(`Generating dungeon with seed ${seed}`);
        
        // Use a reasonable count
        const nodes = generateGraph(seed, this.tileAssets, 15);
        
        const dungeonFolder = new Instance("Folder");
        dungeonFolder.Name = "Dungeon";
        dungeonFolder.Parent = Workspace;

        for (const node of nodes) {
            this.spawnNode(node, dungeonFolder);
        }
        
        Log.info(`Spawned ${nodes.size()} rooms.`);
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
            if (desc.IsA("BasePart") && desc.Name === "EnemySpawn") {
                // Log for now, or fire event
                // Log.info(`Found EnemySpawn at ${desc.Position}`);
            }
        }
    }
}
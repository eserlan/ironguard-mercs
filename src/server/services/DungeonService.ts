import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";
import { generateDungeonGraph, DungeonGraph, GraphNode, validateDungeon, countRoutes, getShortestPathLength, sortNodesDescending } from "../../shared/algorithms/dungeon-gen";
import { TileAsset, ConnectorDirection, Connector } from "../../shared/domain/TileDefs";
import { TileRegistry } from "../../shared/domain/dungeon/TileRegistry";
import { initializeTileRegistry } from "../../shared/domain/dungeon/manifest";
import { ServerStorage, Workspace, CollectionService } from "@rbxts/services";
import { Vec3 } from "../../shared/domain/world";
import { Tags } from "../../shared/domain/tags";

export interface DungeonResult {
    playerSpawns: Vector3[];
    enemySpawns: Vector3[];
    bossSpawn?: Vector3;
    lootSpawn?: Vector3;
    graph: DungeonGraph;
    routeCount: number;
    shortestPath: number;
}

@Service({})
export class DungeonService implements OnStart {
    // Dungeon placement constants
    private static readonly DUNGEON_Y_OFFSET = 500; // Offset to avoid Z-fighting with lobby

    // Wall dimensions
    private static readonly WALL_WIDTH = 12;
    private static readonly WALL_HEIGHT = 16;
    private static readonly WALL_THICKNESS = 2;

    // Door frame dimensions
    private static readonly DOOR_WIDTH = 8;
    private static readonly DOOR_HEIGHT = 10;
    private static readonly FRAME_THICKNESS = 1;
    private static readonly FRAME_DEPTH = 2;
    private static readonly PILLAR_WIDTH = 2;

    private tileAssets: TileAsset[] = [];
    private tileModels = new Map<string, Model>();
    private lastResult?: DungeonResult;

    onStart() {
        initializeTileRegistry();
        this.loadTiles();
    }

    private loadTiles() {
        const folder = ServerStorage.FindFirstChild("Tiles");
        if (!folder) {
            Log.error("ServerStorage/Tiles not found! Critical for Dungeon generation.");
            return;
        }

        const registeredTiles = TileRegistry.getAll();
        Log.info(`[DungeonService] Matching models for ${registeredTiles.size()} registered tiles...`);

        const folderChildren = folder.GetChildren();
        const availableNames = folderChildren.map((c) => c.Name);

        for (const asset of registeredTiles) {
            // Robust matching: exact match
            const model = folderChildren.find((c) => c.Name === asset.id);

            if (model && model.IsA("Model")) {
                this.tileAssets.push(asset);
                this.tileModels.set(asset.id, model);

                const size = model.GetExtentsSize();
                const primary = model.PrimaryPart ? model.PrimaryPart.Name : "NONE";

                // Try to find a floor part to see its size
                let floorInfo = "No Floor part found";
                for (const desc of model.GetDescendants()) {
                    if (desc.IsA("BasePart") && (desc.Name === "Floor" || desc.Name === "FloorBase")) {
                        floorInfo = `Floor size: ${desc.Size.X}, ${desc.Size.Z}`;
                        break;
                    }
                }

                Log.info(`  [OK] ${asset.id} | Bounding: ${math.floor(size.X)}x${math.floor(size.Z)} | Primary: ${primary} | ${floorInfo}`);
            } else {
                Log.warn(`  [MISSING] No model found for ${asset.id}. Available in folder: ${availableNames.join(", ")}`);
            }
        }

        Log.info(`[DungeonService] Ready with ${this.tileAssets.size()} active tiles.`);
    }

    public generate(seed: number): DungeonResult {
        Log.info(`[DungeonService] Generating dungeon with seed: ${seed}`);
        Log.info(`[DungeonService] Tileset has ${this.tileAssets.size()} active tiles.`);

        // Try to generate a valid dungeon, retry with different seeds if needed
        let graph;
        let validation;
        let currentSeed = seed;
        let attempts = 0;
        const maxAttempts = 5;

        do {
            const rng = new Random(currentSeed);
            const minPathLength = rng.NextInteger(12, 18); // Longer dungeons for more exploration
            const maxBranches = rng.NextInteger(2, 4); // More side branches for variety

            Log.info(`[DungeonService] Attempt ${attempts + 1}: Config minPath=${minPathLength}, maxBranches=${maxBranches}`);

            graph = generateDungeonGraph(currentSeed, this.tileAssets, {
                minPathLength,
                maxBranches,
                targetSize: minPathLength + maxBranches + 4
            });
            validation = validateDungeon(graph);

            if (!validation.valid) {
                Log.warn(`[DungeonService] Attempt ${attempts + 1} failed: ${validation.reason}`);
                currentSeed = seed + attempts + 1; // Try a different seed
            }
            attempts++;
        } while (!validation.valid && attempts < maxAttempts);

        Log.info(`[DungeonService] Graph generated with ${graph.nodes.size()} nodes, ${graph.edges.size()} edges`);
        Log.info(`[DungeonService] Main path length: ${graph.mainPathLength} rooms`);

        // Log the tile path sequence for debugging
        const mainPathNodes = graph.nodes.filter(n => n.tags.includes("MainPath"));
        const sortedPath = sortNodesDescending([...mainPathNodes]);
        const pathSequence = sortedPath.map(n => {
            const asset = TileRegistry.get(n.tileId);
            const connectorCount = asset?.connectors.size() ?? 0;
            const tileType = connectorCount === 2 ? "C" : "R"; // C=Corridor, R=Room
            return `${n.id}(${n.tileId}:${tileType}:d${n.distanceFromStart})`;
        }).join(" → ");
        Log.info(`[DungeonService] Path: ${pathSequence}`);

        if (!validation.valid) {
            Log.error(`[DungeonService] Failed to generate valid dungeon after ${maxAttempts} attempts!`);
        }

        const routeCount = countRoutes(graph);
        const shortestPath = getShortestPathLength(graph);
        Log.info(`[DungeonService] Routes to boss: ${routeCount}, Shortest path: ${shortestPath} nodes`);

        const playerSpawns: Vector3[] = [];
        const enemySpawns: Vector3[] = [];
        this.lastResult = {
            playerSpawns,
            enemySpawns,
            graph,
            routeCount,
            shortestPath
        };

        const dungeonFolder = new Instance("Folder");
        dungeonFolder.Name = "GeneratedDungeon";
        dungeonFolder.Parent = Workspace;

        graph.nodes.forEach((node) => {
            this.spawnNode(node, dungeonFolder);
        });

        Log.info(`[DungeonService] Generated ${playerSpawns.size()} player spawns and ${enemySpawns.size()} enemy spawns`);
        if (this.lastResult?.bossSpawn) {
            Log.info(`[DungeonService] Boss room placed with boss at ${this.lastResult.bossSpawn}`);
        } else {
            Log.warn(`[DungeonService] No BossSpawn found in generated dungeon!`);
        }
        return this.lastResult;
    }

    private spawnNode(node: GraphNode, parent: Instance) {
        const modelTemplate = this.tileModels.get(node.tileId);
        const asset = TileRegistry.get(node.tileId);
        if (!modelTemplate || !asset) return;

        const clone = modelTemplate.Clone();
        clone.Name = node.id;

        // Dynamic Server-Side Scaling
        // We compare the physical model size to the intended manifest size
        const currentSize = modelTemplate.GetExtentsSize();
        const scaleFactor = asset.size.x / currentSize.X;

        if (math.abs(scaleFactor - 1) > 0.01) {
            clone.ScaleTo(scaleFactor);
            // Log once for root or if it's a significant scale shift
            if (node.id === "Start") {
                Log.info(`[DungeonService] Scaling nodes to intended ${asset.size.x} studs wide (Factor: ${scaleFactor})`);
            }
        }

        // Rotation: 0=0, 1=90 CW, 2=180, 3=270 CW
        const rotRad = -node.rotation * (math.pi / 2);

        // Adjust Y to avoid Z-fighting/clipping with lobby at origin
        const yOffset = DungeonService.DUNGEON_Y_OFFSET;
        const cf = new CFrame(node.position.x, node.position.y + yOffset, node.position.z)
            .mul(CFrame.Angles(0, rotRad, 0));

        // Find the floor part to calculate pivot offset
        // This ensures all tiles align at floor level regardless of model height
        let floorPart: BasePart | undefined;
        for (const desc of clone.GetDescendants()) {
            if (desc.IsA("BasePart") && (desc.Name === "Floor" || desc.Name === "FloorCenter")) {
                floorPart = desc;
                break;
            }
        }

        if (floorPart) {
            // Calculate offset from model pivot to floor surface (top of floor part)
            const modelPivot = clone.GetPivot();
            const floorTop = floorPart.Position.Y + floorPart.Size.Y / 2;
            const pivotY = modelPivot.Y;
            const yCorrection = pivotY - floorTop;

            // Adjust the target CFrame to compensate for pivot offset
            const adjustedCf = new CFrame(node.position.x, node.position.y + yOffset + yCorrection, node.position.z)
                .mul(CFrame.Angles(0, rotRad, 0));
            clone.PivotTo(adjustedCf);
        } else {
            clone.PivotTo(cf);
        }
        clone.Parent = parent;

        // Block unused connector directions with walls
        this.blockUnusedExits(clone, node, asset, cf);

        // Add roof to enclose the space
        this.addRoof(clone, asset, cf);

        // Add visual indicators based on node tags
        if (node.tags.includes("StartRoom")) {
            this.addStartRoomIndicator(clone, cf);
        }

        if (node.tags.includes("BossRoom")) {
            this.addBossRoomIndicator(clone, cf);
        }

        this.extractMetadata(clone);
    }

    private blockUnusedExits(model: Model, node: GraphNode, asset: TileAsset, cf: CFrame) {
        const cardinalDirs = [
            ConnectorDirection.North,
            ConnectorDirection.East,
            ConnectorDirection.South,
            ConnectorDirection.West
        ];

        // Process ALL 4 cardinal directions
        for (const localDir of cardinalDirs) {
            // Determine the width of this face for wall calculation
            // If facing North/South, the face width is the X size
            // If facing East/West, the face width is the Z size
            const faceWidth = (localDir === ConnectorDirection.North || localDir === ConnectorDirection.South)
                ? asset.size.x
                : asset.size.z;

            // Find if there's a connector defined for this LOCAL direction
            const connector = asset.connectors.find(c => c.direction === localDir);

            // Calculate the World Direction given the node's rotation
            const worldDir = this.rotateDirection(localDir, node.rotation);

            if (connector) {
                // CASE 1: Connector Exists
                // Check if it's used in the graph
                const isUsed = node.usedConnectorDirections.includes(worldDir);

                if (!isUsed) {
                    // Defined connector but NOT used -> BLOCK IT
                    this.addBlockingWall(model, connector, faceWidth, worldDir, cf);
                } else if (asset.connectors.size() === 2) {
                    // Used corridor connector -> OPEN (no frame)
                } else {
                    // Used room connector -> DOOR FRAME + WING WALLS
                    this.addDoorFrame(model, connector, faceWidth, worldDir, cf);
                }
            } else {
                // CASE 2: No Connector Defined
                // Implicit wall -> ALWAYS BLOCK
                const defaultConnector = this.createDefaultConnector(localDir, asset.size);
                this.addBlockingWall(model, defaultConnector, faceWidth, worldDir, cf);
            }
        }
    }

    private createDefaultConnector(dir: ConnectorDirection, size: Vec3): Connector {
        // Calculate default position at the edge of the tile
        let localPos = { x: 0, y: 0, z: 0 };

        // Assuming origin is center
        if (dir === ConnectorDirection.North) {
            localPos = { x: 0, y: 0, z: -size.z / 2 };
        } else if (dir === ConnectorDirection.South) {
            localPos = { x: 0, y: 0, z: size.z / 2 };
        } else if (dir === ConnectorDirection.East) {
            localPos = { x: size.x / 2, y: 0, z: 0 };
        } else if (dir === ConnectorDirection.West) {
            localPos = { x: -size.x / 2, y: 0, z: 0 };
        }

        return {
            direction: dir,
            type: "Wall", // Dummy type
            localPosition: localPos
        };
    }

    private rotateDirection(dir: ConnectorDirection, rotations: number): ConnectorDirection {
        const dirs = [
            ConnectorDirection.North,
            ConnectorDirection.East,
            ConnectorDirection.South,
            ConnectorDirection.West
        ];
        const idx = dirs.indexOf(dir);
        return dirs[(idx + rotations) % 4];
    }

    private addBlockingWall(model: Model, connector: Connector, faceWidth: number, worldDir: ConnectorDirection, cf: CFrame) {
        // SOLID WALL - completely blocks the exit
        const wall = new Instance("Part");
        wall.Name = `BlockedExit_${worldDir}`;
        wall.Anchored = true;
        wall.CanCollide = true;
        wall.Material = Enum.Material.Brick;
        wall.BrickColor = new BrickColor("Dark taupe");

        const wallHeight = DungeonService.WALL_HEIGHT;
        const wallThickness = DungeonService.WALL_THICKNESS;

        const localPos = connector.localPosition;

        // Orientation depends on LOCAL direction
        let wallSize: Vector3;
        if (connector.direction === ConnectorDirection.North || connector.direction === ConnectorDirection.South) {
            // Wall runs along X
            wallSize = new Vector3(faceWidth, wallHeight, wallThickness);
        } else {
            // Wall runs along Z (East/West)
            wallSize = new Vector3(wallThickness, wallHeight, faceWidth);
        }

        const finalLocalPos = new Vector3(localPos.x, wallHeight / 2, localPos.z);

        wall.Size = wallSize;
        wall.CFrame = cf.mul(new CFrame(finalLocalPos));
        wall.Parent = model;
    }

    private addDoorFrame(model: Model, connector: Connector, faceWidth: number, worldDir: ConnectorDirection, cf: CFrame) {
        // DOOR FRAME
        const doorWidth = DungeonService.DOOR_WIDTH;
        const doorHeight = DungeonService.DOOR_HEIGHT;
        const frameThickness = DungeonService.FRAME_THICKNESS;
        const frameDepth = DungeonService.FRAME_DEPTH;
        const pillarWidth = DungeonService.PILLAR_WIDTH;

        const localPos = connector.localPosition;
        const basePos = new Vector3(localPos.x, 0, localPos.z);

        const isNorthSouth = connector.direction === ConnectorDirection.North || connector.direction === ConnectorDirection.South;

        // Left pillar
        const leftPillar = new Instance("Part");
        leftPillar.Name = `DoorFrame_${worldDir}_Left`;
        leftPillar.Anchored = true;
        leftPillar.CanCollide = true;
        leftPillar.Material = Enum.Material.SmoothPlastic;
        leftPillar.BrickColor = new BrickColor("Brown");
        if (isNorthSouth) {
            leftPillar.Size = new Vector3(pillarWidth, doorHeight, frameDepth);
            leftPillar.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(-doorWidth / 2 - pillarWidth / 2, doorHeight / 2, 0))));
        } else {
            leftPillar.Size = new Vector3(frameDepth, doorHeight, pillarWidth);
            leftPillar.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, doorHeight / 2, -doorWidth / 2 - pillarWidth / 2))));
        }
        leftPillar.Parent = model;

        // Right pillar
        const rightPillar = new Instance("Part");
        rightPillar.Name = `DoorFrame_${worldDir}_Right`;
        rightPillar.Anchored = true;
        rightPillar.CanCollide = true;
        rightPillar.Material = Enum.Material.SmoothPlastic;
        rightPillar.BrickColor = new BrickColor("Brown");
        if (isNorthSouth) {
            rightPillar.Size = new Vector3(pillarWidth, doorHeight, frameDepth);
            rightPillar.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(doorWidth / 2 + pillarWidth / 2, doorHeight / 2, 0))));
        } else {
            rightPillar.Size = new Vector3(frameDepth, doorHeight, pillarWidth);
            rightPillar.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, doorHeight / 2, doorWidth / 2 + pillarWidth / 2))));
        }
        rightPillar.Parent = model;

        // Top beam
        const topBeam = new Instance("Part");
        topBeam.Name = `DoorFrame_${worldDir}_Top`;
        topBeam.Anchored = true;
        topBeam.CanCollide = true;
        topBeam.Material = Enum.Material.SmoothPlastic;
        topBeam.BrickColor = new BrickColor("Brown");
        if (isNorthSouth) {
            topBeam.Size = new Vector3(doorWidth + pillarWidth * 2, frameThickness, frameDepth);
            topBeam.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, doorHeight + frameThickness / 2, 0))));
        } else {
            topBeam.Size = new Vector3(frameDepth, frameThickness, doorWidth + pillarWidth * 2);
            topBeam.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, doorHeight + frameThickness / 2, 0))));
        }
        topBeam.Parent = model;

        // WING WALLS - fill original gaps on sides of door
        const wingWallWidth = (faceWidth - (doorWidth + pillarWidth * 2)) / 2;
        const wallHeight = DungeonService.WALL_HEIGHT;
        const wallThickness = DungeonService.WALL_THICKNESS;

        if (wingWallWidth > 0) {
            // Left Wing
            const leftWing = new Instance("Part");
            leftWing.Name = `WingWall_${worldDir}_Left`;
            leftWing.Anchored = true;
            leftWing.Material = Enum.Material.Brick;
            leftWing.BrickColor = new BrickColor("Dark taupe");
            if (isNorthSouth) {
                leftWing.Size = new Vector3(wingWallWidth, wallHeight, wallThickness);
                leftWing.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(-(doorWidth / 2 + pillarWidth) - wingWallWidth / 2, wallHeight / 2, 0))));
            } else {
                leftWing.Size = new Vector3(wallThickness, wallHeight, wingWallWidth);
                leftWing.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, wallHeight / 2, -(doorWidth / 2 + pillarWidth) - wingWallWidth / 2))));
            }
            leftWing.Parent = model;

            // Right Wing
            const rightWing = new Instance("Part");
            rightWing.Name = `WingWall_${worldDir}_Right`;
            rightWing.Anchored = true;
            rightWing.Material = Enum.Material.Brick;
            rightWing.BrickColor = new BrickColor("Dark taupe");
            if (isNorthSouth) {
                rightWing.Size = new Vector3(wingWallWidth, wallHeight, wallThickness);
                rightWing.CFrame = cf.mul(new CFrame(basePos.add(new Vector3((doorWidth / 2 + pillarWidth) + wingWallWidth / 2, wallHeight / 2, 0))));
            } else {
                rightWing.Size = new Vector3(wallThickness, wallHeight, wingWallWidth);
                rightWing.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, wallHeight / 2, (doorWidth / 2 + pillarWidth) + wingWallWidth / 2))));
            }
            rightWing.Parent = model;
        }

        // HEAD WALL - fill gap above door frame up to roof
        const headWallHeight = wallHeight - (doorHeight + frameThickness);
        if (headWallHeight > 0) {
            const headWall = new Instance("Part");
            headWall.Name = `HeadWall_${worldDir}`;
            headWall.Anchored = true;
            headWall.Material = Enum.Material.Brick;
            headWall.BrickColor = new BrickColor("Dark taupe");

            if (isNorthSouth) {
                headWall.Size = new Vector3(doorWidth + pillarWidth * 2, headWallHeight, wallThickness);
                headWall.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, doorHeight + frameThickness + headWallHeight / 2, 0))));
            } else {
                headWall.Size = new Vector3(wallThickness, headWallHeight, doorWidth + pillarWidth * 2);
                headWall.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, doorHeight + frameThickness + headWallHeight / 2, 0))));
            }
            headWall.Parent = model;
        }

        // The actual door
        const door = new Instance("Part");
        door.Name = `Door_${worldDir}`;
        door.Anchored = true;
        door.CanCollide = true; // Closed by default
        door.Material = Enum.Material.Wood;
        door.BrickColor = new BrickColor("Reddish brown");
        door.Transparency = 0; // Solid

        // Configure for interaction
        door.SetAttribute("IsOpen", false);
        CollectionService.AddTag(door, Tags.DungeonDoor);

        if (isNorthSouth) {
            door.Size = new Vector3(doorWidth, doorHeight, 0.5);
            // Pivot at -X (Left side)
            door.PivotOffset = new CFrame(-doorWidth / 2, 0, 0);
            door.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, doorHeight / 2, 0))));
        } else {
            door.Size = new Vector3(0.5, doorHeight, doorWidth);
            // Pivot at -Z (Left side in local Z)
            door.PivotOffset = new CFrame(0, 0, -doorWidth / 2);
            door.CFrame = cf.mul(new CFrame(basePos.add(new Vector3(0, doorHeight / 2, 0))));
        }
        door.Parent = model;
    }

    private addStartRoomIndicator(model: Model, cf: CFrame) {
        // Create a green glowing beacon above the start room
        const beacon = new Instance("Part");
        beacon.Name = "StartBeacon";
        beacon.Size = new Vector3(4, 20, 4);
        beacon.Anchored = true;
        beacon.CanCollide = false;
        beacon.Material = Enum.Material.Neon;
        beacon.BrickColor = new BrickColor("Lime green");
        beacon.Transparency = 0.3;
        beacon.CFrame = cf.add(new Vector3(0, 15, 0));
        beacon.Parent = model;

        // Add a flat ring on the floor
        const ring = new Instance("Part");
        ring.Name = "StartRing";
        ring.Shape = Enum.PartType.Cylinder;
        ring.Size = new Vector3(1, 30, 30);
        ring.Anchored = true;
        ring.CanCollide = false;
        ring.Material = Enum.Material.Neon;
        ring.BrickColor = new BrickColor("Lime green");
        ring.Transparency = 0.5;
        ring.CFrame = cf.add(new Vector3(0, 0.6, 0)).mul(CFrame.Angles(0, 0, math.rad(90)));
        ring.Parent = model;

        Log.info(`[DungeonService] Added Start room visual indicator`);
    }

    private addBossRoomIndicator(model: Model, cf: CFrame) {
        // Create a red glowing beacon above the boss room
        const beacon = new Instance("Part");
        beacon.Name = "BossBeacon";
        beacon.Size = new Vector3(6, 30, 6);
        beacon.Anchored = true;
        beacon.CanCollide = false;
        beacon.Material = Enum.Material.Neon;
        beacon.BrickColor = new BrickColor("Really red");
        beacon.Transparency = 0.3;
        beacon.CFrame = cf.add(new Vector3(0, 20, 0));
        beacon.Parent = model;

        // Add a skull-like ring pattern on the floor
        const ring = new Instance("Part");
        ring.Name = "BossRing";
        ring.Shape = Enum.PartType.Cylinder;
        ring.Size = new Vector3(1, 35, 35);
        ring.Anchored = true;
        ring.CanCollide = false;
        ring.Material = Enum.Material.Neon;
        ring.BrickColor = new BrickColor("Really red");
        ring.Transparency = 0.5;
        ring.CFrame = cf.add(new Vector3(0, 0.6, 0)).mul(CFrame.Angles(0, 0, math.rad(90)));
        ring.Parent = model;

        Log.info(`[DungeonService] Added Boss room visual indicator`);
    }

    private addRoof(model: Model, asset: TileAsset, cf: CFrame) {
        // CEILING - encloses the room from above
        const ceiling = new Instance("Part");
        ceiling.Name = "Ceiling";
        ceiling.Size = new Vector3(asset.size.x, 1, asset.size.z);
        ceiling.Anchored = true;
        ceiling.CanCollide = true;
        ceiling.Material = Enum.Material.Concrete;
        ceiling.BrickColor = new BrickColor("Medium stone grey");

        // Positioned at WAL_HEIGHT above floor level
        const wallHeight = DungeonService.WALL_HEIGHT;
        ceiling.CFrame = cf.mul(new CFrame(0, wallHeight + 0.5, 0));
        ceiling.Parent = model;
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
                } else if (desc.Name === "BossSpawn") {
                    if (this.lastResult) {
                        this.lastResult.bossSpawn = desc.Position;
                    }
                    desc.Transparency = 1;
                    desc.CanCollide = false;
                    Log.info(`[DungeonService] Found BossSpawn at ${desc.Position}`);
                } else if (desc.Name === "LootSpawn") {
                    if (this.lastResult) {
                        this.lastResult.lootSpawn = desc.Position;
                    }
                    desc.Transparency = 1;
                    desc.CanCollide = false;
                    Log.info(`[DungeonService] Found LootSpawn at ${desc.Position}`);
                }
            }
        }
    }
}
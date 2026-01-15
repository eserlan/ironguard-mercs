import { Service, OnStart } from "@flamework/core";
import { createWavePlan } from "../../shared/algorithms/wave-plan";
import { Log } from "../../shared/utils/log";
import { EnemyVisualService } from "./EnemyVisualService";
import { EnemyRegistry } from "shared/domain/enemies/config";
import { ServerStorage, Workspace, CollectionService, PhysicsService, HttpService } from "@rbxts/services";
import { AIService } from "./AIService";
import { CollectionTag } from "shared/constants/CollectionTags";

@Service({})
export class EnemySpawnService implements OnStart {
    constructor(
        private visualService: EnemyVisualService,
        private aiService: AIService,
    ) {
        // Initialize collision groups
        PhysicsService.RegisterCollisionGroup("Enemies");
        PhysicsService.CollisionGroupSetCollidable("Enemies", "Enemies", false);
    }

    onStart() { }

    public startWaves(seed: number, difficulty: number) {
        const plan = createWavePlan(seed, difficulty);
        Log.info("Starting waves...", plan);
    }

    private static readonly DUMMY_ASSET_ID = 623773712;

    public spawnEnemy(enemyId: string, cframe: CFrame) {
        const archetype = EnemyRegistry.get(enemyId);
        if (!archetype) {
            Log.warn(`Unknown enemy: ${enemyId}`);
            return;
        }

        // Load the R15 dummy from ReplicatedStorage
        const ReplicatedStorage = game.GetService("ReplicatedStorage");
        const assetsFolder = ReplicatedStorage.FindFirstChild("assets");
        if (!assetsFolder) {
            Log.error("ReplicatedStorage/assets folder not found");
            return;
        }

        const baseRig = assetsFolder.FindFirstChild("R15 Dummy") as Model;
        if (!baseRig) {
            Log.error("ReplicatedStorage/assets/R15 Dummy model not found");
            return;
        }

        const rig = baseRig.Clone();
        rig.Name = archetype.name;

        const root = rig.FindFirstChild("HumanoidRootPart") as BasePart;
        const humanoid = rig.FindFirstChildOfClass("Humanoid");

        if (root) {
            rig.PrimaryPart = root;
        }

        // Apply visual properties (colors, eyes, weapons) - scaling disabled
        this.visualService.setupEnemyVisuals(rig, archetype);

        // Position at spawn point (EnemySpot marker is at floor level)
        // Add small offset to ensure feet are above floor, not in it
        const spawnOffset = new Vector3(0, 3, 0);
        rig.PivotTo(cframe.add(spawnOffset));

        // Just set collision group for enemy-enemy non-collision
        for (const descendant of rig.GetDescendants()) {
            if (descendant.IsA("BasePart")) {
                descendant.CollisionGroup = "Enemies";
            }
        }

        // Parent to Workspace - let Roblox handle physics like player
        rig.Parent = Workspace;

        Log.info(`Spawned ${archetype.name} at ${cframe.add(spawnOffset).Position}`);

        // Set Network Ownership after parenting to Workspace
        if (root) {
            root.SetNetworkOwner(undefined); // Server-authoritative movement
        }

        // Set Role for AI
        rig.SetAttribute("Role", archetype.role);
        rig.SetAttribute("InstanceId", HttpService.GenerateGUID(false).sub(1, 4));

        // Register with AI
        this.aiService.registerEnemy(rig);

        // Tag for Animations
        CollectionService.AddTag(rig, CollectionTag.GothicConstruct);

        // Tag for Health & Set Stats
        const health = archetype.stats.hp;
        rig.SetAttribute("MaxHealth", health);
        rig.SetAttribute("Health", health);
        CollectionService.AddTag(rig, "Health");

        print(`[EnemySpawnService] Successfully spawned enemy ${enemyId} (${archetype.name}) at ${cframe}`);
        return rig;
    }
}

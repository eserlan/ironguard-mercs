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

    public spawnEnemy(enemyId: string, cframe: CFrame) {
        const archetype = EnemyRegistry.get(enemyId);
        if (!archetype) {
            Log.warn(`Unknown enemy: ${enemyId}`);
            return;
        }

        const enemyRigs = ServerStorage.FindFirstChild("EnemyRigs");
        if (!enemyRigs) {
            Log.error("ServerStorage/EnemyRigs folder missing");
            return;
        }

        const baseRig = enemyRigs.FindFirstChild("EnemyBaseR15") as Model;
        if (!baseRig) {
            Log.error("ServerStorage/EnemyRigs/EnemyBaseR15 model missing");
            return;
        }

        const rig = baseRig.Clone();
        rig.Name = archetype.name;

        const root = rig.FindFirstChild("HumanoidRootPart") as BasePart;
        const humanoid = rig.FindFirstChildOfClass("Humanoid") as Humanoid;

        if (root) {
            rig.PrimaryPart = root;
        }

        // Apply visual properties (colors, scales) BEFORE welding
        this.visualService.setupEnemyVisuals(rig, archetype);

        // Apply CFrame with height offset AFTER scaling
        const modelSize = rig.GetExtentsSize();
        const offset = new Vector3(0, modelSize.Y / 2, 0);
        rig.PivotTo(cframe.mul(new CFrame(offset)));

        if (root) {
            // Physical assembly (Welding and CollisionGroups)
            for (const descendant of rig.GetDescendants()) {
                if (descendant.IsA("BasePart")) {
                    descendant.CollisionGroup = "Enemies";

                    if (descendant !== root) {
                        descendant.CanCollide = false;
                        descendant.Massless = true;

                        const weld = new Instance("WeldConstraint");
                        weld.Part0 = root;
                        weld.Part1 = descendant;
                        weld.Parent = descendant;
                    }
                }
            }
        }

        if (humanoid) {
            humanoid.HipHeight = 2.0; // Standard for our 2x2x1 RootPart rig
        }

        rig.Parent = Workspace;

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

        print(`[EnemySpawnService] Successfully spawned enemy ${enemyId} (${archetype.name}) at ${cframe}`);
        return rig;
    }
}

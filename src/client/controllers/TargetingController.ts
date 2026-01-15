import { Controller, OnStart, OnRender } from "@flamework/core";
import { ContextActionService, CollectionService, Workspace, Players, RunService } from "@rbxts/services";
import { CollectionTag } from "shared/constants/CollectionTags";
import { Maid } from "shared/utils/Maid";
import { Log } from "shared/utils/log";

@Controller({})
export class TargetingController implements OnStart, OnRender {
    private currentTarget: Model | undefined;
    private maid = new Maid(); // Manages current target listeners/highlight
    private lastCycleTime = 0;

    // Config
    private readonly MAX_TARGET_DISTANCE = 100;
    private readonly HIGHLIGHT_COLOR = new Color3(1, 0.2, 0); // Red-Orange
    private readonly HIGHLIGHT_FILL_TRANSPARENCY = 0.8;
    private readonly HIGHLIGHT_OUTLINE_TRANSPARENCY = 0.1;

    onStart() {
        Log.info("TargetingController started");

        ContextActionService.BindAction(
            "CycleTarget",
            (_, state) => {
                if (state === Enum.UserInputState.Begin) {
                    this.cycleTarget();
                }
                return Enum.ContextActionResult.Sink;
            },
            false,
            Enum.KeyCode.T // Changed from Tab (Roblox default) to T
        );
    }

    onRender(dt: number) {
        // Update: Check if target is still valid/alive
        if (this.currentTarget) {
            const human = this.currentTarget.FindFirstChildOfClass("Humanoid");
            if (!this.currentTarget.IsDescendantOf(Workspace) || (human && human.Health <= 0)) {
                this.clearTarget();
            }
        }
    }

    private cycleTarget() {
        const candidates = this.getValidTargets();
        Log.info(`Targeting: Found ${candidates.size()} candidates`); // Debug log

        if (candidates.size() === 0) {
            this.clearTarget();
            return;
        }

        // Sort by distance to camera
        const camera = Workspace.CurrentCamera;
        const camPos = camera ? camera.CFrame.Position : new Vector3();

        // Helper to get distance
        const getDist = (model: Model) => {
            const pivot = model.GetPivot().Position;
            return pivot.sub(camPos).Magnitude;
        };

        // Sort candidates by distance (ascending)
        candidates.sort((a, b) => getDist(a) < getDist(b));

        // Logic:
        // 1. If we have no target, pick the closest (index 0).
        // 2. If we have a target, find its index. Pick next. Wrap around.
        // However, sorting by distance every time means "Next" might jump around if you move.
        // Standard tab-targeting often just cycles through available targets.

        let nextIndex = 0;
        if (this.currentTarget) {
            const currentIndex = candidates.indexOf(this.currentTarget);
            if (currentIndex !== -1) {
                nextIndex = (currentIndex + 1) % candidates.size();
            }
        }

        const nextTarget = candidates[nextIndex];
        this.setTarget(nextTarget);
    }

    private getValidTargets(): Model[] {
        const tagged = CollectionService.GetTagged(CollectionTag.GothicConstruct);
        const valid: Model[] = [];
        const camera = Workspace.CurrentCamera;

        if (!camera) return [];

        const camPos = camera.CFrame.Position;

        for (const obj of tagged) {
            if (obj.IsA("Model")) {
                const human = obj.FindFirstChildOfClass("Humanoid");
                const root = obj.FindFirstChild("HumanoidRootPart");

                if (human && human.Health > 0 && root && obj.IsDescendantOf(Workspace)) {
                    // Distance check
                    const dist = obj.GetPivot().Position.sub(camPos).Magnitude;
                    if (dist <= this.MAX_TARGET_DISTANCE) {
                        valid.push(obj);
                    }
                }
            }
        }
        return valid;
    }

    private setTarget(target: Model) {
        if (this.currentTarget === target) return;

        this.clearTarget();
        this.currentTarget = target;
        this.maid = new Maid(); // Fresh maid for new target

        Log.info(`Target set: ${target.Name}`);

        // Create Highlight
        const highlight = new Instance("Highlight");
        highlight.Adornee = target;
        highlight.FillColor = this.HIGHLIGHT_COLOR;
        highlight.OutlineColor = this.HIGHLIGHT_COLOR;
        highlight.FillTransparency = this.HIGHLIGHT_FILL_TRANSPARENCY;
        highlight.OutlineTransparency = this.HIGHLIGHT_OUTLINE_TRANSPARENCY;
        highlight.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop; // Changed for better visibility debugging
        highlight.Parent = target; // Or CoreGui? Parent to target is easiest for cleanup. client-side only.

        this.maid.GiveTask(highlight);

        // Auto-clear if ancestry changes
        this.maid.GiveTask(target.AncestryChanged.Connect(() => {
            if (!target.IsDescendantOf(Workspace)) {
                this.clearTarget();
            }
        }));

        // Auto-clear on death
        const human = target.FindFirstChildOfClass("Humanoid");
        if (human) {
            this.maid.GiveTask(human.Died.Connect(() => this.clearTarget()));
        }
    }

    private clearTarget() {
        if (this.currentTarget) {
            this.currentTarget = undefined;
            this.maid.Destroy(); // Cleans up highlight and listeners
            this.maid = new Maid(); // Reset
        }
    }
}

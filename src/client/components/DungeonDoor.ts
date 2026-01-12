import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { TweenService } from "@rbxts/services";
import { Tags } from "shared/domain/tags";

@Component({
    tag: Tags.DungeonDoor,
})
export class DungeonDoorClient extends BaseComponent<object, Part> implements OnStart {
    private closedPivot!: CFrame;
    private openPivot!: CFrame;
    private tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

    onStart() {
        // Capture the initial (closed) state
        this.closedPivot = this.instance.GetPivot();
        // Calculate open state (90 degrees rotation around Y)
        this.openPivot = this.closedPivot.mul(CFrame.Angles(0, math.rad(90), 0));

        // Listen for state changes
        this.instance.GetAttributeChangedSignal("IsOpen").Connect(() => {
            this.updateState();
        });

        // Initial sync
        this.updateState();
    }

    private updateState() {
        const isOpen = this.instance.GetAttribute("IsOpen") as boolean;
        const prompt = this.instance.FindFirstChildWhichIsA("ProximityPrompt");

        // Target Pivot CFrame
        const targetPivot = isOpen ? this.openPivot : this.closedPivot;

        // Convert Pivot CFrame to Part CFrame
        // PartCFrame = PivotCFrame * PivotOffset:Inverse()
        const targetPartCFrame = targetPivot.mul(this.instance.PivotOffset.Inverse());

        // Tween
        TweenService.Create(this.instance, this.tweenInfo, {
            CFrame: targetPartCFrame
        }).Play();

        // Update Prompt
        if (prompt) {
            prompt.ActionText = isOpen ? "Close" : "Open";
        }
    }
}

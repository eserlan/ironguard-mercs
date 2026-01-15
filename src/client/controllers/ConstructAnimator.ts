import { Controller, OnStart } from "@flamework/core";
import { CollectionService, RunService } from "@rbxts/services";
import { CollectionTag } from "shared/constants/CollectionTags";

@Controller({})
export class ConstructAnimator implements OnStart {
    private constructs = new Map<Model, { startPivot: CFrame; timeOffset: number }>();

    onStart() {
        // Listen for new constructs
        CollectionService.GetInstanceAddedSignal(CollectionTag.GothicConstruct).Connect((instance) => {
            if (instance.IsA("Model")) {
                this.registerConstruct(instance);
            }
        });

        // Handle existing constructs
        for (const instance of CollectionService.GetTagged(CollectionTag.GothicConstruct)) {
            if (instance.IsA("Model")) {
                this.registerConstruct(instance);
            }
        }

        // Update loop
        RunService.Heartbeat.Connect((dt) => this.update(dt));
    }

    private registerConstruct(model: Model) {
        this.constructs.set(model, {
            startPivot: model.GetPivot(),
            timeOffset: math.random() * math.pi * 2,
        });

        model.Destroying.Connect(() => this.constructs.delete(model));
    }

    private update(dt: number) {
        const now = tick();

        for (const [model, data] of this.constructs) {
            const humanoid = model.FindFirstChildOfClass("Humanoid");
            if (!humanoid) continue;

            // 1. Procedural Movement Animation (Bobbing & Tilting)
            const speed = humanoid.MoveDirection.Magnitude;
            const isMoving = speed > 0.1;

            // We find the visual parts to offset
            // Note: We don't want to move the HumanoidRootPart as that affects physics/server positioning
            // Instead we animate the "visual" children if they were unanchored, 
            // but since they ARE anchored in our R15 json, we have to Pivot the model visual-only? 
            // Actually, PivotTo moves the RootPart too. 

            // If the bits are anchored, we should probably unanchor them and use welds if we wanted real physics,
            // but since this is procedural "fake" movement, we can Pivot the whole model slightly relative to its actual position.

            // HEARTBEAT EFFECT (Neon Core)
            const core = model.FindFirstChild("Head")?.FindFirstChild("Core") as BasePart | undefined;
            if (core) {
                const pulse = (math.sin(now * 4 + data.timeOffset) + 1) / 2; // 0 to 1
                core.Transparency = 0.2 + pulse * 0.4;
                // Optional: Size pulse
                // core.Size = new Vector3(0.4, 0.4, 0.4).mul(1 + pulse * 0.2);
            }

            // EYES PULSE
            const head = model.FindFirstChild("Head");
            if (head) {
                const leftEye = head.FindFirstChild("LeftEye") as BasePart | undefined;
                const rightEye = head.FindFirstChild("RightEye") as BasePart | undefined;
                const eyePulse = (math.sin(now * 2 + data.timeOffset) + 1) / 2;
                if (leftEye) leftEye.Transparency = eyePulse * 0.5;
                if (rightEye) rightEye.Transparency = eyePulse * 0.5;
            }

            // BOBBING (Visual Only)
            // Because the rig is anchored on the server, we can't easily animate it on the client 
            // without fighting the server's Anchored property or unanchoring it.
            // Let's assume for now we just want the glowing effects. 
            // If we want movement "wobble", we'd need to unanchor the visual parts on the client.
        }
    }
}

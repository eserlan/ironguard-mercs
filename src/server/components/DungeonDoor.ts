import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Tags } from "../../shared/domain/tags";

@Component({
    tag: Tags.DungeonDoor,
})
export class DungeonDoor extends BaseComponent<object, Part> implements OnStart {
    onStart() {
        this.setupPrompt();

        // Listen for attribute changes to update physics
        this.instance.GetAttributeChangedSignal("IsOpen").Connect(() => {
            this.updatePhysics();
        });

        // Initial state
        this.updatePhysics();
    }

    private setupPrompt() {
        const prompt = new Instance("ProximityPrompt");
        prompt.ActionText = "Open";
        prompt.ObjectText = "Door";
        prompt.MaxActivationDistance = 8;
        prompt.RequiresLineOfSight = false;
        prompt.Parent = this.instance;

        prompt.Triggered.Connect(() => {
            const isOpen = this.instance.GetAttribute("IsOpen") as boolean;
            this.instance.SetAttribute("IsOpen", !isOpen);
        });
    }

    private updatePhysics() {
        const isOpen = this.instance.GetAttribute("IsOpen") as boolean;
        // When open, players can walk through (CanCollide = false)
        // When closed, solid (CanCollide = true)
        this.instance.CanCollide = !isOpen;
    }
}


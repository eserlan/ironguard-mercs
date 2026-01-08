import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";

@Component({
    tag: "LobbyGearBench",
})
export class GearBenchComponent extends StationComponent {
    protected onTriggered() {
        this.openStation("Bench");
    }
}

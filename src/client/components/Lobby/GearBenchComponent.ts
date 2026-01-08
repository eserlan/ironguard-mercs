import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";

@Component({
    tag: "LobbyGearBench",
})
export class GearBenchComponent extends StationComponent {
    protected onTriggered() {
        print("[Lobby] GearBench triggered - opening Bench station");
        this.openStation("Bench");
    }
}

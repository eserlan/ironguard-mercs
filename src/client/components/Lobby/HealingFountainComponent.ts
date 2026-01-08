import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";
import { Log } from "shared/utils/log";

@Component({
    tag: "LobbyHealingFountain",
})
export class HealingFountainComponent extends StationComponent {
    protected onTriggered() {
        Log.info("[Lobby] HealingFountain triggered - opening Healing Fountain station");
        this.openStation("Healing Fountain");
    }
}

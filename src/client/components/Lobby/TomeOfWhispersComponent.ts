import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";

@Component({
    tag: "LobbyTomeOfWhispers",
})
export class TomeOfWhispersComponent extends StationComponent {
    protected onTriggered() {
        this.openStation("Tome of Whispers");
    }
}

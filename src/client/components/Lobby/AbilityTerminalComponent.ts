import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";

@Component({
	tag: "LobbyAbilityTerminal",
})
export class AbilityTerminalComponent extends StationComponent {
	protected onTriggered() {
		this.openStation("Terminal");
	}
}

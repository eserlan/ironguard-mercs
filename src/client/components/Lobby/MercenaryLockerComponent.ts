import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";

@Component({
	tag: "LobbyMercenaryLocker",
})
export class MercenaryLockerComponent extends StationComponent {
	protected onTriggered() {
		this.openStation("Locker");
	}
}

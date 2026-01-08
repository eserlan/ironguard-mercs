import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";
import { LobbyController } from "client/controllers/LobbyController";
import { MissionMode } from "shared/domain/party/party-types";

@Component({
	tag: "LobbyModeBanner",
})
export class ModeBannerComponent extends StationComponent {
	constructor(lobbyController: LobbyController) {
		super(lobbyController);
	}

	onStart() {
		super.onStart();
		this.lobbyController.subscribe((state) => {
			if (state.room) {
				this.instance.SetAttribute("Mode", state.room.mode);
			} else {
				this.instance.SetAttribute("Mode", MissionMode.Standard);
			}
		});
	}

	protected onTriggered() {
		const state = this.lobbyController.getState();
		if (!state.room) return;

		const nextMode = state.room.mode === MissionMode.Standard ? MissionMode.Ironman : MissionMode.Standard;
		this.lobbyController.setMissionMode(nextMode);
	}
}

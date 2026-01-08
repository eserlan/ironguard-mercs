import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";
import { LobbyController } from "client/controllers/LobbyController";

@Component({
	tag: "LobbyDifficultyPedestal",
})
export class DifficultyPedestalComponent extends StationComponent {
	constructor(lobbyController: LobbyController) {
		super(lobbyController);
	}

	protected onTriggered() {
		const state = this.lobbyController.getState();
		if (!state.room) return;

		// Cycle 1-5
		let nextDifficulty = state.room.difficulty + 1;
		if (nextDifficulty > 5) nextDifficulty = 1;

		this.lobbyController.setDifficulty(nextDifficulty);
	}
}

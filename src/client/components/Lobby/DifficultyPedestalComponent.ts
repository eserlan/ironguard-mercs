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

	onStart() {
		super.onStart();
		this.lobbyController.subscribe((state) => {
			if (state.room) {
				this.instance.SetAttribute("Difficulty", state.room.difficulty);
			} else {
				this.instance.SetAttribute("Difficulty", 1);
			}
		});
	}

	protected onTriggered() {
		const state = this.lobbyController.getState();
		if (!state.room) {
			// Solo pseudo-room logic if needed, but for now just 1
			return;
		}

		// Cycle 1-5
		let nextDifficulty = state.room.difficulty + 1;
		if (nextDifficulty > 5) nextDifficulty = 1;

		this.lobbyController.setDifficulty(nextDifficulty);
	}
}

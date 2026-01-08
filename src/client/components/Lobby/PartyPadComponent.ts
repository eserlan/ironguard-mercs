import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Events } from "client/events";
import { Players, RunService } from "@rbxts/services";

const DETECTION_INTERVAL_SECONDS = 0.5;

@Component({
	tag: "LobbyPartyPad",
})
export class PartyPadComponent extends BaseComponent<object, BasePart> implements OnStart {
	private playersOnPad = new Set<Player>();
	private timeSinceLastCheck = 0;

	onStart() {
		print(`[Lobby] PartyPad component started on: ${this.instance.GetFullName()}`);

		RunService.Heartbeat.Connect((dt) => {
			this.timeSinceLastCheck += dt;
			if (this.timeSinceLastCheck >= DETECTION_INTERVAL_SECONDS) {
				this.timeSinceLastCheck = 0;
				this.updateDetection();
			}
		});
	}

	private updateDetection() {
		const parts = game.Workspace.GetPartsInPart(this.instance);
		const currentPlayers = new Set<Player>();

		for (const part of parts) {
			const character = part.Parent;
			if (character && character.IsA("Model")) {
				const player = Players.GetPlayerFromCharacter(character);
				if (player) {
					currentPlayers.add(player);
				}
			}
		}

		// Local player logic
		const localPlayer = Players.LocalPlayer;
		const wasOnPad = this.playersOnPad.has(localPlayer);
		const isOnPad = currentPlayers.has(localPlayer);

		if (!wasOnPad && isOnPad) {
			print("[Lobby] PartyPad - player stepped ON pad");
			Events.StepOnPad();
		} else if (wasOnPad && !isOnPad) {
			print("[Lobby] PartyPad - player stepped OFF pad");
			Events.StepOffPad();
		}

		this.playersOnPad = currentPlayers;
	}
}

import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Events } from "client/events";
import { Players, RunService } from "@rbxts/services";

@Component({
	tag: "LobbyPartyPad",
})
export class PartyPadComponent extends BaseComponent<{}, BasePart> implements OnStart {
	private playersOnPad = new Set<Player>();

	onStart() {
		RunService.Heartbeat.Connect(() => this.updateDetection());
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
			Events.StepOnPad();
		} else if (wasOnPad && !isOnPad) {
			Events.StepOffPad();
		}

		this.playersOnPad = currentPlayers;
	}
}

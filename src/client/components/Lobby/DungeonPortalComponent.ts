import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { LobbyController } from "client/controllers/LobbyController";
import { Players } from "@rbxts/services";

const LAUNCH_DEBOUNCE_SECONDS = 2;

@Component({
	tag: "LobbyDungeonPortal",
})
export class DungeonPortalComponent extends BaseComponent<object, BasePart> implements OnStart {
	private active = false;
	private lastLaunchTime = 0;

	constructor(private lobbyController: LobbyController) {
		super();
	}

	onStart() {
		this.instance.Touched.Connect((otherPart) => {
			if (!this.active) return;

			// Debounce to prevent multiple rapid triggers
			const now = os.clock();
			if (now - this.lastLaunchTime < LAUNCH_DEBOUNCE_SECONDS) return;

			const character = otherPart.Parent;
			if (!character || !character.IsA("Model")) return;

			const player = Players.GetPlayerFromCharacter(character);
			if (player === Players.LocalPlayer) {
				this.lastLaunchTime = now;
				this.lobbyController.launchMission();
			}
		});

		// Listen to lobby state to activate/deactivate
		this.lobbyController.subscribe((state) => {
			if (state.room) {
				const allReady = state.room.members.every((m) => m.selectedMercenaryId !== undefined && m.isReady);
				this.setActive(allReady);
			} else {
				// Solo check
				this.setActive(state.soloMercenaryId !== undefined);
			}
		});
	}

	private setActive(active: boolean) {
		this.active = active;
		this.instance.Transparency = active ? 0.5 : 0.9;
		this.instance.CanCollide = false;

		// VFX: Toggle all particle emitters
		this.instance.GetDescendants().forEach((child) => {
			if (child.IsA("ParticleEmitter")) {
				child.Enabled = active;
			}
		});
	}
}

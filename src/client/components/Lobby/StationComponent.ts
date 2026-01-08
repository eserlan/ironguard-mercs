import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { LobbyController } from "client/controllers/LobbyController";
import { LobbyState } from "shared/domain/party/party-types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StationAttributes {
}

@Component({})
export abstract class StationComponent<A = StationAttributes, I extends Instance = BasePart> extends BaseComponent<A, I> implements OnStart {
	constructor(protected lobbyController: LobbyController) {
		super();
	}

	onStart() {
		const instance = this.instance as unknown as BasePart;
		print(`[Lobby] StationComponent started on: ${instance.GetFullName()}`);
		const prompt = instance.FindFirstChildWhichIsA("ProximityPrompt") ?? this.createPrompt();
		prompt.Triggered.Connect(() => {
			print(`[Lobby] ProximityPrompt triggered on: ${instance.GetFullName()}`);
			this.onTriggered();
		});
	}

	protected abstract onTriggered(): void;

	private createPrompt(): ProximityPrompt {
		const instance = this.instance as unknown as BasePart;
		const prompt = new Instance("ProximityPrompt");
		prompt.ActionText = "Interact";
		prompt.ObjectText = instance.Name;
		prompt.Parent = instance;
		return prompt;
	}

	protected openStation(stationType: "Roster Altar" | "Healing Fountain" | "Tome of Whispers") {
		print(`[Lobby] Opening station: ${stationType}`);
		this.lobbyController.setStation(LobbyState.AtStation, stationType);
	}
}

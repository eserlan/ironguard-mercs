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
		const prompt = instance.FindFirstChildWhichIsA("ProximityPrompt") ?? this.createPrompt();
		prompt.Triggered.Connect(() => this.onTriggered());
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

	protected openStation() {
		this.lobbyController.setStation(LobbyState.AtStation);
	}
}

import { Controller, OnStart } from "@flamework/core";
import { ContextActionService, UserInputService } from "@rbxts/services";
import { Events } from "client/events";
import { Log } from "shared/utils/log";

@Controller({})
export class AbilityController implements OnStart {
	private seq = 0;
	onStart() {
		Log.info("AbilityController started");

		// Bind inputs
		ContextActionService.BindAction("UseAbility1", (_, state) => this.handleInput(0, state), false, Enum.KeyCode.One);
		ContextActionService.BindAction("UseAbility2", (_, state) => this.handleInput(1, state), false, Enum.KeyCode.Two);
		ContextActionService.BindAction("UseAbility3", (_, state) => this.handleInput(2, state), false, Enum.KeyCode.Three);
		ContextActionService.BindAction("UseAbility4", (_, state) => this.handleInput(3, state), false, Enum.KeyCode.Four);

		// Listen for activation confirmations (for visuals/cooldowns)
		Events.AbilityActivated.connect((sourceId, abilityId, slotIndex) => {
			Log.info(`Ability Activated: ${abilityId} (Slot ${slotIndex}) by ${sourceId}`);
		});
	}

	public requestCast(slotIndex: number, action?: "Top" | "Bottom") {
		this.performCast(slotIndex, action);
	}

	private handleInput(slotIndex: number, state: Enum.UserInputState): Enum.ContextActionResult {
		if (state === Enum.UserInputState.Begin) {
			this.performCast(slotIndex);
		}
		return Enum.ContextActionResult.Pass;
	}

	private performCast(slotIndex: number, overrideAction?: "Top" | "Bottom") {
		const isShift = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift) || UserInputService.IsKeyDown(Enum.KeyCode.RightShift);
		const action = overrideAction ?? (isShift ? "Top" : "Bottom");

		Log.info(`Requesting Cast: Slot ${slotIndex} (${action})`);
		this.seq++;

		Events.AbilityIntent({
			slotIndex: slotIndex,
			action: action,
			timestamp: os.clock(),
			seq: this.seq,
			payload: {},
		});
	}
}

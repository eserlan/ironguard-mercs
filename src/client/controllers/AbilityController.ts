import { Controller, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { Events } from "client/events";
import { Log } from "shared/utils/log";

@Controller({})
export class AbilityController implements OnStart {
	private seq = 0;
	onStart() {
		Log.info("AbilityController started");

		// Bind inputs via UserInputService for more reliable combos
		UserInputService.InputBegan.Connect((input, processed) => {
			if (processed) return;

			if (input.KeyCode === Enum.KeyCode.One) this.handleUisInput(0);
			if (input.KeyCode === Enum.KeyCode.Two) this.handleUisInput(1);
			if (input.KeyCode === Enum.KeyCode.Three) this.handleUisInput(2);
			if (input.KeyCode === Enum.KeyCode.Four) this.handleUisInput(3);
		});

		// Listen for activation confirmations (for visuals/cooldowns)
		Events.AbilityActivated.connect((sourceId, abilityId, slotIndex) => {
			Log.info(`Ability Activated: ${abilityId} (Slot ${slotIndex}) by ${sourceId}`);
		});
	}

	public requestCast(slotIndex: number, action?: "Top" | "Bottom") {
		this.performCast(slotIndex, action);
	}

	private handleUisInput(slotIndex: number) {
		const isShift = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift) || UserInputService.IsKeyDown(Enum.KeyCode.RightShift);
		Log.info(`[AbilityController] UIS Hotkey: Slot ${slotIndex} | Shift: ${isShift}`);
		this.performCast(slotIndex);
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

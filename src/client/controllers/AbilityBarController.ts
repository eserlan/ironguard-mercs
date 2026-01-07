import { Controller, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { Log } from "../../shared/utils/log";

@Controller({})
export class AbilityBarController implements OnStart {
	onStart() {
		Log.info("AbilityBarController started");

		UserInputService.InputBegan.Connect((input, processed) => {
			if (processed) return;

			const slot = this.getSlotFromKey(input.KeyCode);
			if (slot !== undefined) {
				const isShift = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift);
				this.castAbility(slot, isShift ? "Top" : "Bottom");
			}
		});
	}

	private castAbility(slotIndex: number, action: "Top" | "Bottom") {
		Log.info(`Requesting ${action} cast for slot ${slotIndex}`);
		// Real impl: send intent via GlobalEvents
	}

	private getSlotFromKey(code: Enum.KeyCode): number | undefined {
		if (code === Enum.KeyCode.One) return 1;
		if (code === Enum.KeyCode.Two) return 2;
		if (code === Enum.KeyCode.Three) return 3;
		if (code === Enum.KeyCode.Four) return 4;
		return undefined;
	}
}

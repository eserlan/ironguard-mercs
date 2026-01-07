import { Controller, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Controller({})
export class ProgressionController implements OnStart {
	onStart() {
		Log.info("ProgressionController started");
	}

	public handleChoiceEvent(_choices: unknown[], _timeout: number) {
		Log.info("Level up choices received!");
		// Trigger UI
	}

	public playSlowMoEffect() {
		// Real impl: Tween camera or post-processing
	}
}

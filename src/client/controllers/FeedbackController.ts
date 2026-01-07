import { Controller, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Controller({})
export class FeedbackController implements OnStart {
	onStart() {
		Log.info("FeedbackController initialized");
	}

	public onHit(isCrit: boolean) {
		Log.info(isCrit ? "CRITICAL HIT!" : "Hit!");
		// In real app: Show crosshair hit-marker UI, play 'tick' sound
	}

	public onKill() {
		Log.info("KILL CONFIRMED");
	}
}
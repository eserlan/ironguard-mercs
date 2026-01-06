import { Controller, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Controller({})
export class TelegraphController implements OnStart {
	onStart() {
		Log.info("TelegraphController started");
		// Listen to GlobalEvents.TelegraphStarted
	}

	public renderTelegraph(origin: Vector3, type: string, duration: number) {
		// Mock: Spawn a decal/part at origin
		Log.info(`Rendering ${type} telegraph for ${duration}s`);
	}
}

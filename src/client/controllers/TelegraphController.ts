import { Controller, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Controller({})
export class TelegraphController implements OnStart {
	onStart() {
		Log.info("TelegraphController started");
		// Listen to GlobalEvents.TelegraphStarted
	}

	public renderTelegraph(origin: Vector3, telegraphType: string, duration: number) {
		// Mock: Spawn a decal/part at origin
		Log.info(`Rendering ${telegraphType} telegraph for ${duration}s`);
	}
}

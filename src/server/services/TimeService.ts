import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class TimeService implements OnStart {
	onStart() {}

	public startMicroSlow(duration: number) {
		Log.info(`Micro Slow started for ${duration}s`);
		// Real impl: set game speed or notify clients to slow local time
	}
}

import { Controller, OnStart } from "@flamework/core";
import { GlobalEvents } from "../../shared/net";
import { MatchState, MatchPhase } from "../../shared/domain/run";
import { Log } from "../../shared/utils/log";

@Controller({})
export class RunController implements OnStart {
	private state: MatchState | undefined;

	onStart() {
		Log.info("RunController started");
		GlobalEvents.client.RunStateChanged.connect((newState) => {
			this.state = newState;
			Log.info("New State:", newState.phase);
		});
	}

	public requestStart() {
		GlobalEvents.client.RequestStartRun.fire(12345);
	}

	public getState(): MatchState | undefined {
		return this.state;
	}
}

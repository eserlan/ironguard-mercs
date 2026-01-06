import { Controller, OnStart } from "@flamework/core";
import { GlobalEvents } from "../../shared/net";
import { MatchState, MatchPhase } from "../../shared/domain/types";
import { Log } from "../../shared/utils/log";

@Controller({})
export class RunController implements OnStart {
	private state: MatchState = { phase: MatchPhase.Lobby, wave: 0, enemiesAlive: 0 };

	onStart() {
		Log.info("RunController started");
		GlobalEvents.client.RunStateChanged.connect((newState) => {
			this.state = newState;
			Log.info("New State:", newState);
		});
	}

	public requestStart() {
		GlobalEvents.client.RequestStartRun.fire(12345);
	}
}

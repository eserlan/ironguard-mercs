import { Controller, OnStart } from "@flamework/core";
import { Events } from "../events";

@Controller({})
export class RunController implements OnStart {
	onStart() {
		Events.RunStateChanged.connect((newState: unknown) => {
			print("Match state changed:", newState);
		});
	}

	public startRun() {
		Events.RequestStartRun.fire(12345);
	}
}

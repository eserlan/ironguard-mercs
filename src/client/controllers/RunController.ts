import { Controller, OnStart } from "@flamework/core";
import { Events } from "../events";
import { MatchState, MatchPhase } from "shared/domain/run";

export type MatchStateListener = (state: MatchState) => void;

@Controller({})
export class RunController implements OnStart {
	private currentState?: MatchState;
	private listeners = new Set<MatchStateListener>();

	onStart() {
		Events.RunStateChanged.connect((newState) => {
			this.currentState = newState;
			this.listeners.forEach((l) => l(newState));
			print("Match state changed:", newState.phase);
		});
	}

	subscribe(cb: MatchStateListener) {
		this.listeners.add(cb);
		if (this.currentState) cb(this.currentState);
		return () => this.listeners.delete(cb);
	}

	getPhase() {
		return this.currentState?.phase ?? MatchPhase.Lobby;
	}

	public startRun() {
		Events.RequestStartRun.fire(12345);
	}
}

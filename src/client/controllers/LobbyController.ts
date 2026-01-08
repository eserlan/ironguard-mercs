import { Controller, OnStart } from "@flamework/core";
import { Events } from "client/events";
import { PartyRoom, LobbyState, MissionMode } from "shared/domain/party/party-types";

export interface LobbyUiState {
	status: LobbyState;
	activeStation?: "Locker" | "Bench";
	room?: PartyRoom;
	soloMercenaryId?: string;
	error?: string;
}

export type StateListener = (state: LobbyUiState) => void;

@Controller({})
export class LobbyController implements OnStart {
	private state: LobbyUiState = { status: LobbyState.Idle };
	private listeners = new Set<StateListener>();

	onStart() {
		Events.PartyCreated.connect((code) => {
			// Optional: could show notification
		});

		Events.PartyJoined.connect((room) => {
			this.updateState({ status: LobbyState.InParty, room });
		});

		Events.PartyUpdated.connect((room) => {
			this.updateState({ room });
		});

		Events.PartyLeft.connect(() => {
			this.updateState({ status: LobbyState.Idle, room: undefined });
		});

		Events.MissionLaunching.connect((seed) => {
			this.updateState({ status: LobbyState.Launching });
		});
	}

	createParty() {
		this.updateState({ status: LobbyState.Creating });
		Events.CreateParty();
	}

	joinParty(code: string) {
		this.updateState({ status: LobbyState.Joining });
		Events.JoinParty(code);
	}

	leaveParty() {
		Events.LeaveParty();
	}

	selectMercenary(mercId: string) {
		this.updateState({ soloMercenaryId: mercId });
		Events.SelectMercenary(mercId);
	}

	equipGear(slot: string, gearId: string) {
		Events.EquipItem(slot, gearId);
	}

	setReady(ready: boolean) {
		Events.SetReady(ready);
	}

	setMissionMode(mode: MissionMode) {
		Events.SetMissionMode(mode);
	}

	setDifficulty(difficulty: number) {
		Events.SetDifficulty(difficulty);
	}

	setStation(station: LobbyState.AtStation | LobbyState.Idle, type?: "Locker" | "Bench") {
		this.updateState({
			status: station,
			activeStation: station === LobbyState.AtStation ? type : undefined
		});
	}

	launchMission() {
		Events.LaunchMission();
	}

	subscribe(listener: StateListener) {
		this.listeners.add(listener);
		listener(this.state);
		return () => this.listeners.delete(listener);
	}

	getState() {
		return this.state;
	}

	private updateState(partial: Partial<LobbyUiState>) {
		this.state = { ...this.state, ...partial };
		for (const listener of this.listeners) {
			listener(this.state);
		}
	}
}

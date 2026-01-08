import { Controller, OnStart } from "@flamework/core";
import { Events } from "client/events";
import { PartyRoom, LobbyState, MissionMode } from "shared/domain/party/party-types";

export interface LobbyUiState {
	status: LobbyState;
	activeStation?: "Locker" | "Bench" | "Terminal";
	room?: PartyRoom;
	soloMercenaryId?: string;
	abilityLoadout: { slotIndex: number; abilityId: string }[];
	unlockedClassIds: string[];
	error?: string;
}

export type StateListener = (state: LobbyUiState) => void;

@Controller({})
export class LobbyController implements OnStart {
	private state: LobbyUiState = {
		status: LobbyState.Idle,
		abilityLoadout: [],
		unlockedClassIds: ["shield-saint", "ashblade"] // Default starters
	};
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

		Events.UnlockedClassesUpdated.connect((classIds) => {
			this.updateState({ unlockedClassIds: classIds });
		});

		Events.LoadoutConfirmed.connect((classId, slots) => {
			this.updateState({ abilityLoadout: slots });
		});

		Events.LoadoutRejected.connect((reason) => {
			this.updateState({ error: reason });
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

	setLoadout(slots: { slotIndex: number; abilityId: string }[]) {
		Events.SetLoadout(slots);
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

	setStation(station: LobbyState.AtStation | LobbyState.Idle, stationType?: "Locker" | "Bench" | "Terminal") {
		this.updateState({
			status: station,
			activeStation: station === LobbyState.AtStation ? stationType : undefined
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

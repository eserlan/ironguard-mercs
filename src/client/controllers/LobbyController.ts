import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "client/events";
import { PartyRoom, LobbyState, MissionMode } from "shared/domain/party/party-types";
import { Log } from "shared/utils/log";
import { showAlertNotification } from "../ui/utils/AlertNotification";

export interface LobbyUiState {
	status: LobbyState;
	activeStation?: "Roster Altar" | "Healing Fountain" | "Tome of Whispers";
	room?: PartyRoom;
	soloMercenaryId?: string;
	soloDifficulty: number;
	soloMode: MissionMode;
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
		unlockedClassIds: ["shield-saint", "ashblade"], // Default starters
		soloDifficulty: 1,
		soloMode: MissionMode.Standard
	};
	private listeners = new Set<StateListener>();

	private getLocalPlayerId(): string {
		return tostring(Players.LocalPlayer?.UserId ?? 0);
	}

	onStart() {
		Events.PartyCreated.connect((_code) => {
			// Optional: could show notification
		});

		Events.PartyJoined.connect((room) => {
			this.updateStatusFromRoom(room);
		});

		Events.PartyUpdated.connect((room) => {
			this.updateStatusFromRoom(room);
		});

		Events.PartyLeft.connect(() => {
			this.updateState({ status: LobbyState.Idle, room: undefined });
		});

		Events.MissionLaunching.connect((_seed) => {
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

		Events.LaunchAlert.connect((message) => {
			Log.warn(`[Lobby] Launch alert: ${message}`);
			this.updateState({ error: message });

			// Show a prominent in-game notification
			showAlertNotification(message);

			// Auto-clear the error after 4 seconds
			task.delay(4, () => {
				if (this.state.error === message) {
					this.updateState({ error: undefined });
				}
			});
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
		if (this.state.room) {
			const newMembers = this.state.room.members.map((m) =>
				m.playerId === this.getLocalPlayerId() ? { ...m, selectedMercenaryId: mercId } : m,
			);
			this.updateState({
				room: { ...this.state.room, members: newMembers },
			});
		}
		Events.SelectMercenary(mercId);
	}

	setLoadout(slots: { slotIndex: number; abilityId: string }[]) {
		Events.SetLoadout(slots);
	}

	equipGear(slot: string, gearId: string) {
		Events.EquipItem(slot, gearId);
	}

	setReady(ready: boolean) {
		// Optimistic update for UI feel
		if (this.state.room) {
			const status = ready ? LobbyState.Ready : LobbyState.InParty;
			const newMembers = this.state.room.members.map((m) =>
				m.playerId === this.getLocalPlayerId() ? { ...m, isReady: ready } : m,
			);
			this.updateState({
				status,
				room: { ...this.state.room, members: newMembers },
			});
		}
		Events.SetReady(ready);
	}

	private updateStatusFromRoom(room: PartyRoom) {
		const localMember = room.members.find((m) => m.playerId === this.getLocalPlayerId());
		const isReady = localMember?.isReady ?? false;
		const status = isReady ? LobbyState.Ready : LobbyState.InParty;

		this.updateState({ status, room });
	}

	setMissionMode(mode: MissionMode) {
		this.updateState({ soloMode: mode });
		Events.SetMissionMode(mode);
	}

	setDifficulty(difficulty: number) {
		this.updateState({ soloDifficulty: difficulty });
		Events.SetDifficulty(difficulty);
	}

	setStation(station: LobbyState.AtStation | LobbyState.Idle, stationType?: "Roster Altar" | "Healing Fountain" | "Tome of Whispers") {
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
		const updatedKeys: string[] = [];
		for (const [k] of pairs(partial as unknown as object)) {
			updatedKeys.push(k as string);
		}
		const keysStr = updatedKeys.join(", ");
		Log.info(`[LobbyController] Updating state fields: ${keysStr}`);
		this.state = { ...this.state, ...partial };
		for (const listener of this.listeners) {
			listener(this.state);
		}
	}
}

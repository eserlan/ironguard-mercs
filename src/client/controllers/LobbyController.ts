import { Controller, OnStart } from "@flamework/core";
import { Players, TweenService } from "@rbxts/services";
import { Events } from "client/events";
import { PartyRoom, LobbyState, MissionMode } from "shared/domain/party/party-types";
import { Log } from "shared/utils/log";

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
	private getLocalPlayerId(): string {
		return tostring(Players.LocalPlayer?.UserId ?? 0);
	}
	private state: LobbyUiState = {
		status: LobbyState.Idle,
		abilityLoadout: [],
		unlockedClassIds: ["shield-saint", "ashblade"], // Default starters
		soloDifficulty: 1,
		soloMode: MissionMode.Standard
	};
	private listeners = new Set<StateListener>();

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
			this.showAlertNotification(message);

			// Auto-clear the error after 4 seconds
			task.delay(4, () => {
				if (this.state.error === message) {
					this.updateState({ error: undefined });
				}
			});
		});
	}

	private showAlertNotification(message: string) {
		const playerGui = Players.LocalPlayer?.FindFirstChild("PlayerGui") as PlayerGui | undefined;
		if (!playerGui) return;

		// Remove any existing alert
		const existing = playerGui.FindFirstChild("LaunchAlertGui");
		if (existing) existing.Destroy();

		// Create a new ScreenGui for the alert
		const screenGui = new Instance("ScreenGui");
		screenGui.Name = "LaunchAlertGui";
		screenGui.ResetOnSpawn = false;
		screenGui.DisplayOrder = 999;
		screenGui.Parent = playerGui;

		// Create the alert frame
		const frame = new Instance("Frame");
		frame.Name = "AlertFrame";
		frame.Size = new UDim2(0, 500, 0, 80);
		frame.Position = new UDim2(0.5, -250, 0, 120);
		frame.BackgroundColor3 = Color3.fromRGB(180, 50, 50);
		frame.BorderSizePixel = 0;
		frame.Parent = screenGui;

		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 12);
		corner.Parent = frame;

		const stroke = new Instance("UIStroke");
		stroke.Color = Color3.fromRGB(255, 100, 100);
		stroke.Thickness = 3;
		stroke.Parent = frame;

		// Warning icon
		const icon = new Instance("TextLabel");
		icon.Name = "Icon";
		icon.Size = new UDim2(0, 60, 1, 0);
		icon.Position = new UDim2(0, 0, 0, 0);
		icon.BackgroundTransparency = 1;
		icon.Text = "⚠️";
		icon.TextSize = 36;
		icon.Font = Enum.Font.GothamBold;
		icon.TextColor3 = Color3.fromRGB(255, 255, 255);
		icon.Parent = frame;

		// Message text
		const label = new Instance("TextLabel");
		label.Name = "Message";
		label.Size = new UDim2(1, -70, 1, 0);
		label.Position = new UDim2(0, 60, 0, 0);
		label.BackgroundTransparency = 1;
		label.Text = message;
		label.TextSize = 22;
		label.Font = Enum.Font.GothamBold;
		label.TextColor3 = Color3.fromRGB(255, 255, 255);
		label.TextWrapped = true;
		label.TextXAlignment = Enum.TextXAlignment.Left;
		label.Parent = frame;

		// Animate in
		frame.BackgroundTransparency = 1;
		label.TextTransparency = 1;
		icon.TextTransparency = 1;

		const fadeIn = TweenService.Create(frame, new TweenInfo(0.2), { BackgroundTransparency: 0 });
		const textFadeIn = TweenService.Create(label, new TweenInfo(0.2), { TextTransparency: 0 });
		const iconFadeIn = TweenService.Create(icon, new TweenInfo(0.2), { TextTransparency: 0 });

		fadeIn.Play();
		textFadeIn.Play();
		iconFadeIn.Play();

		// Auto-remove after 4 seconds with fade out
		task.delay(3.5, () => {
			if (screenGui.Parent) {
				const fadeOut = TweenService.Create(frame, new TweenInfo(0.5), { BackgroundTransparency: 1 });
				const textFadeOut = TweenService.Create(label, new TweenInfo(0.5), { TextTransparency: 1 });
				const iconFadeOut = TweenService.Create(icon, new TweenInfo(0.5), { TextTransparency: 1 });

				fadeOut.Play();
				textFadeOut.Play();
				iconFadeOut.Play();

				fadeOut.Completed.Connect(() => {
					screenGui.Destroy();
				});
			}
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
		const HttpService = game.GetService("HttpService");
		Log.info(`[LobbyController] Updating state: ${HttpService.JSONEncode(partial)}`);
		this.state = { ...this.state, ...partial };
		for (const listener of this.listeners) {
			listener(this.state);
		}
	}
}

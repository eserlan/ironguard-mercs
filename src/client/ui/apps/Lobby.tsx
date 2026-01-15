import React, { useState, useEffect, useMemo } from "@rbxts/react";
import { Players, CollectionService } from "@rbxts/services";
import { useLobby } from "client/ui/hooks/useLobby";
import { LobbyState } from "shared/domain/party/party-types";
import { MercenarySelector } from "client/ui/components/MercenarySelector";
import { AbilitySelector } from "client/ui/components/AbilitySelector";
import { PartyPanel } from "client/ui/components/PartyPanel";
import { LobbyBillboard } from "client/ui/components/LobbyBillboard";
import { LoadoutEditor } from "client/ui/components/LoadoutEditor";
import { AbilityBar } from "client/ui/AbilityBar";
import { WeaponStatus } from "client/ui/WeaponStatus";
import { Dependency } from "@flamework/core";
import { AbilityController } from "client/controllers/AbilityController";

export function Lobby() {
	const { state, controller } = useLobby();
	const [pads, setPads] = useState<BasePart[]>([]);
	const [tempSelectedClass, setTempSelectedClass] = useState<string | undefined>();

	useEffect(() => {
		const updatePads = () => {
			const unityPads = CollectionService.GetTagged("LobbyCircleOfUnity") as BasePart[];
			const partyPads = CollectionService.GetTagged("LobbyPartyPad") as BasePart[];
			setPads([...unityPads, ...partyPads]);
		};

		updatePads();

		const sub1 = CollectionService.GetInstanceAddedSignal("LobbyCircleOfUnity").Connect(updatePads);
		const sub2 = CollectionService.GetInstanceAddedSignal("LobbyPartyPad").Connect(updatePads);

		return () => {
			sub1.Disconnect();
			sub2.Disconnect();
		};
	}, []);

	// NEW: Auto-select character if one is already active (restored from persistence)
	useEffect(() => {
		if (state.activeStation === "Roster Altar" && state.activeStation !== undefined) {
			const member = state.room?.members.find((m) => m.playerId === tostring(Players.LocalPlayer.UserId));
			const selectedId = member?.selectedMercenaryId ?? state.soloMercenaryId;

			// If we have a selected class and currently haven't picked one in the temp UI
			if (selectedId && !tempSelectedClass) {
				setTempSelectedClass(selectedId);
			}
		}
	}, [state.activeStation, state.room, state.soloMercenaryId, tempSelectedClass]);

	const abilityController = useMemo(() => Dependency<AbilityController>(), []);

	const localPlayerId = tostring(Players.LocalPlayer.UserId);

	if (state.status === LobbyState.Launching) {
		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(0, 0, 0)} ZIndex={100}>
				<textlabel
					Text="LAUNCHING MISSION..."
					Size={new UDim2(1, 0, 1, 0)}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextSize={48}
					Font={Enum.Font.GothamBlack}
				/>
			</frame>
		);
	}

	const isInParty = state.room !== undefined;
	const isAtStation = state.status === LobbyState.AtStation;

	const localMember = state.room?.members.find((m) => m.playerId === localPlayerId);
	const selectedMerc = localMember?.selectedMercenaryId ?? state.soloMercenaryId;
	const currentLoadout = localMember?.loadout;

	return (
		<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1} key="LobbyRoot">

			{/* Billboard UIs for Pads */}
			{state.room && pads.map((pad) => (
				<LobbyBillboard key={pad.GetFullName()} room={state.room!} adornee={pad} />
			))}

			{/* Station UI (Locker or Gear Bench or Terminal) */}
			{isAtStation && (
				<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1} ZIndex={1}>
					{/* Dark overlay background */}
					<frame
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundColor3={Color3.fromRGB(0, 0, 0)}
						BackgroundTransparency={0.4}
						ZIndex={1}
					/>

					{/* Station content */}
					<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1} ZIndex={2}>
						{state.activeStation === "Roster Altar" ? (
							!tempSelectedClass ? (
								<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
									<uipadding PaddingTop={new UDim(0, 50)} PaddingBottom={new UDim(0, 50)} PaddingLeft={new UDim(0, 50)} PaddingRight={new UDim(0, 50)} />
									<MercenarySelector
										selectedId={selectedMerc}
										unlockedIds={state.unlockedClassIds}
										onSelect={(id) => {
											setTempSelectedClass(id);
										}}
									/>
								</frame>
							) : (
								<AbilitySelector
									classId={tempSelectedClass}
									initialLoadout={state.abilityLoadout}
									onConfirm={(slots) => {
										controller.selectMercenary(tempSelectedClass);
										controller.setLoadout(slots);
										controller.setStation(LobbyState.Idle);
										setTempSelectedClass(undefined);
									}}
								/>
							)
						) : state.activeStation === "Tome of Whispers" ? (
							selectedMerc ? (
								<AbilitySelector
									classId={selectedMerc}
									initialLoadout={state.abilityLoadout}
									onConfirm={(slots) => {
										controller.setLoadout(slots);
										controller.setStation(LobbyState.Idle);
									}}
								/>
							) : (
								<frame
									Size={new UDim2(0, 500, 0, 150)}
									Position={new UDim2(0.5, -250, 0.5, -75)}
									BackgroundColor3={Color3.fromRGB(40, 30, 30)}
									ZIndex={5}
								>
									<uicorner CornerRadius={new UDim(0, 12)} />
									<textlabel
										Text="PLEDGE A MERC AT THE ROSTER ALTAR FIRST"
										Size={new UDim2(1, 0, 1, 0)}
										BackgroundTransparency={1}
										TextColor3={Color3.fromRGB(255, 100, 100)}
										Font={Enum.Font.GothamBold}
										TextSize={28}
										TextWrapped={true}
										ZIndex={5}
									/>
								</frame>
							)
						) : (
							<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
								<uipadding PaddingTop={new UDim(0, 50)} PaddingBottom={new UDim(0, 50)} PaddingLeft={new UDim(0, 50)} PaddingRight={new UDim(0, 50)} />
								<LoadoutEditor
									loadout={currentLoadout}
									onEquip={(slot, id) => controller.equipGear(slot, id)}
								/>
							</frame>
						)}

						{/* Back button - upper right corner */}
						<textbutton
							Text="X BACK"
							Size={new UDim2(0, 120, 0, 50)}
							Position={new UDim2(1, -150, 0, 30)}
							BackgroundColor3={Color3.fromRGB(180, 50, 50)}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							TextSize={22}
							Event={{
								Activated: () => {
									if (tempSelectedClass) {
										setTempSelectedClass(undefined);
									} else {
										controller.setStation(LobbyState.Idle);
									}
								}
							}}
						>
							<uicorner CornerRadius={new UDim(0, 10)} />
						</textbutton>
					</frame>
				</frame>
			)}

			{/* Party HUD (Shown if in a party) */}
			{isInParty && (
				<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1} ZIndex={10}>
					<PartyPanel
						room={state.room!}
						isHost={state.room!.hostId === localPlayerId}
						localPlayerId={localPlayerId}
						onReady={(r) => controller.setReady(r)}
						onLaunch={() => controller.launchMission()}
						onSetMode={(m) => controller.setMissionMode(m)}
						onSetDifficulty={(d) => controller.setDifficulty(d)}
						onLeave={() => controller.leaveParty()}
						onSelectMerc={() => controller.setStation(LobbyState.AtStation, "Roster Altar")}
					/>
				</frame>
			)}

			{/* Ability HUD (Always visible in Lobby for testing) */}
			{/* Bottom HOTBAR Container */}
			<frame
				Size={new UDim2(1, 0, 0, 150)}
				Position={new UDim2(0.5, 0, 1, -10)}
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundTransparency={1}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
					Padding={new UDim(0, 10)}
				/>

				<WeaponStatus />
				<AbilityBar
					loadout={state.abilityLoadout}
					controller={abilityController}
					onActiveInfoChange={() => { }} // No info panel in lobby customization for now
				/>
			</frame>
		</frame>
	);
}

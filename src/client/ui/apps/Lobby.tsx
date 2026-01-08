import React, { useState, useEffect } from "@rbxts/react";
import { Players, CollectionService } from "@rbxts/services";
import { useLobby } from "client/ui/hooks/useLobby";
import { LobbyState } from "shared/domain/party/party-types";
import { MercenarySelector } from "client/ui/components/MercenarySelector";
import { PartyPanel } from "client/ui/components/PartyPanel";
import { LobbyBillboard } from "client/ui/components/LobbyBillboard";

export function Lobby() {
	const { state, controller } = useLobby();
	const [pads, setPads] = useState<BasePart[]>([]);

	useEffect(() => {
		setPads(CollectionService.GetTagged("LobbyPartyPad") as BasePart[]);
		const sub = CollectionService.GetInstanceAddedSignal("LobbyPartyPad").Connect((inst) => {
			if (inst.IsA("BasePart")) setPads((prev) => [...prev, inst]);
		});
		return () => sub.Disconnect();
	}, []);

	const localPlayerId = tostring(Players.LocalPlayer.UserId);

	if (state.status === LobbyState.Launching) {
		return (
			<screengui IgnoreGuiInset>
				<textlabel
					Text="LAUNCHING MISSION..."
					Size={new UDim2(1, 0, 1, 0)}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextSize={48}
					Font={Enum.Font.GothamBlack}
				/>
			</screengui>
		);
	}

	const isInParty = (state.status === LobbyState.InParty || state.status === LobbyState.Ready) && state.room !== undefined;
	const isAtStation = state.status === LobbyState.AtStation;
	const selectedMerc = state.room?.members.find((m) => m.playerId === localPlayerId)?.selectedMercenaryId;

	return (
		<screengui IgnoreGuiInset ResetOnSpawn={false}>
			{/* Billboard UIs for Pads */}
			{state.room && pads.map((pad) => (
				<LobbyBillboard key={pad.GetFullName()} room={state.room!} adornee={pad} />
			))}

			{/* Mercenary Selector (Shown only when interacting with Locker) */}
			{isAtStation && (
				<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(20, 20, 20)} BackgroundTransparency={0.2}>
					<uipadding PaddingTop={new UDim(0, 50)} PaddingBottom={new UDim(0, 50)} PaddingLeft={new UDim(0, 50)} PaddingRight={new UDim(0, 50)} />
					
					<MercenarySelector
						selectedId={selectedMerc}
						onSelect={(id) => {
							controller.selectMercenary(id);
							controller.setStation(LobbyState.Idle);
						}}
					/>

					<textbutton
						Text="CLOSE"
						Size={new UDim2(0, 100, 0, 40)}
						Position={new UDim2(0.5, -50, 1, -40)}
						BackgroundColor3={Color3.fromRGB(200, 50, 50)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={Enum.Font.GothamBold}
						Event={{ Activated: () => controller.setStation(LobbyState.Idle) }}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />
					</textbutton>
				</frame>
			)}

			{/* Party HUD (Shown if in a party) */}
			{isInParty && (
				<PartyPanel
					room={state.room!}
					isHost={state.room!.hostId === localPlayerId}
					localPlayerId={localPlayerId}
					onReady={(r) => controller.setReady(r)}
					onLaunch={() => controller.launchMission()}
					onSetMode={(m) => controller.setMissionMode(m)}
					onLeave={() => controller.leaveParty()}
				/>
			)}
		</screengui>
	);
}
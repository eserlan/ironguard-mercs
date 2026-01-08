import React, { useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { useLobby } from "client/ui/hooks/useLobby";
import { LobbyState } from "shared/domain/party/party-types";
import { MercenarySelector } from "client/ui/components/MercenarySelector";
import { PartyPanel } from "client/ui/components/PartyPanel";

export function Lobby() {
	const { state, controller } = useLobby();
	const [joinCode, setJoinCode] = useState("");

	const localPlayerId = tostring(Players.LocalPlayer.UserId);

	if (state.status === LobbyState.Launching) {
		return (
			<textlabel
				Text="LAUNCHING MISSION..."
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={48}
				Font={Enum.Font.GothamBlack}
			/>
		);
	}

	const isInParty = (state.status === LobbyState.InParty || state.status === LobbyState.Ready) && state.room !== undefined;
	const selectedMerc = state.room?.members.find((m) => m.playerId === localPlayerId)?.selectedMercenaryId;

	return (
		<screengui IgnoreGuiInset ResetOnSpawn={false}>
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(20, 20, 20)}>
				<uipadding PaddingTop={new UDim(0, 20)} PaddingBottom={new UDim(0, 20)} PaddingLeft={new UDim(0, 20)} PaddingRight={new UDim(0, 20)} />
				
				{/* Mercenary Selector (Left Side) */}
				<MercenarySelector
					selectedId={selectedMerc}
					onSelect={(id) => controller.selectMercenary(id)}
				/>

				{/* Right Panel */}
				{isInParty ? (
					<PartyPanel
						room={state.room!}
						isHost={state.room!.hostId === localPlayerId}
						localPlayerId={localPlayerId}
						onReady={(r) => controller.setReady(r)}
						onLaunch={() => controller.launchMission()}
						onSetMode={(m) => controller.setMissionMode(m)}
						onLeave={() => controller.leaveParty()}
					/>
				) : (
					<frame
						Size={new UDim2(0, 300, 0, 250)}
						Position={new UDim2(0.5, -150, 0.5, -125)}
						BackgroundColor3={Color3.fromRGB(40, 40, 40)}
					>
						<uicorner CornerRadius={new UDim(0, 12)} />
						<uipadding PaddingTop={new UDim(0, 20)} PaddingLeft={new UDim(0, 20)} PaddingRight={new UDim(0, 20)} PaddingBottom={new UDim(0, 20)} />
						
						<textlabel 
							Text="LOBBY" 
							Size={new UDim2(1, 0, 0, 30)} 
							BackgroundTransparency={1} 
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							TextSize={24}
						/>

						<textbutton
							Text="CREATE PARTY"
							Size={new UDim2(1, 0, 0, 40)}
							Position={new UDim2(0, 0, 0, 50)}
							BackgroundColor3={Color3.fromRGB(100, 100, 200)}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							Event={{ Activated: () => controller.createParty() }}
						>
							<uicorner CornerRadius={new UDim(0, 8)} />
						</textbutton>

						<frame Size={new UDim2(1, 0, 0, 1)} Position={new UDim2(0, 0, 0, 110)} BackgroundColor3={Color3.fromRGB(60, 60, 60)} />

						<textbox
							PlaceholderText="ENTER CODE"
							Text={joinCode}
							Size={new UDim2(1, 0, 0, 40)}
							Position={new UDim2(0, 0, 0, 130)}
							BackgroundColor3={Color3.fromRGB(30, 30, 30)}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.Gotham}
							Change={{ Text: (rbx) => setJoinCode(rbx.Text) }}
						>
							<uicorner CornerRadius={new UDim(0, 8)} />
						</textbox>

						<textbutton
							Text="JOIN PARTY"
							Size={new UDim2(1, 0, 0, 40)}
							Position={new UDim2(0, 0, 0, 180)}
							BackgroundColor3={Color3.fromRGB(100, 200, 100)}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							Event={{ Activated: () => controller.joinParty(joinCode) }}
						>
							<uicorner CornerRadius={new UDim(0, 8)} />
						</textbutton>
					</frame>
				)}
			</frame>
		</screengui>
	);
}

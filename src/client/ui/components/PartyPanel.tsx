import React from "@rbxts/react";
import { PartyRoom, MissionMode } from "shared/domain/party/party-types";

interface PartyPanelProps {
	room: PartyRoom;
	isHost: boolean;
	localPlayerId: string;
	onReady: (ready: boolean) => void;
	onLaunch: () => void;
	onSetMode: (mode: MissionMode) => void;
	onLeave: () => void;
}

export function PartyPanel({ room, isHost, localPlayerId, onReady, onLaunch, onSetMode, onLeave }: PartyPanelProps) {
	const localMember = room.members.find((m) => m.playerId === localPlayerId);
	const canLaunch = isHost && room.members.every((m) => m.isReady && m.selectedMercenaryId !== undefined);

	return (
		<frame
			Size={new UDim2(0, 300, 1, 0)}
			Position={new UDim2(1, -300, 0, 0)}
			BackgroundColor3={Color3.fromRGB(40, 40, 40)}
			BorderSizePixel={0}
		>
			<uipadding PaddingTop={new UDim(0, 20)} PaddingLeft={new UDim(0, 20)} PaddingRight={new UDim(0, 20)} PaddingBottom={new UDim(0, 20)} />

			<textlabel
				Text={`CODE: ${room.code}`}
				Size={new UDim2(1, 0, 0, 40)}
				TextSize={32}
				Font={Enum.Font.GothamBold}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
			/>

			{/* Mode Selector */}
			<frame Size={new UDim2(1, 0, 0, 50)} Position={new UDim2(0, 0, 0, 50)} BackgroundTransparency={1}>
				{isHost ? (
					<textbutton
						Text={room.mode}
						Size={new UDim2(1, 0, 0, 30)}
						BackgroundColor3={Color3.fromRGB(60, 60, 60)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={Enum.Font.Gotham}
						TextSize={20}
						Event={{
							Activated: () =>
								onSetMode(
									room.mode === MissionMode.Standard ? MissionMode.Ironman : MissionMode.Standard,
								),
						}}
					>
						<uicorner CornerRadius={new UDim(0, 6)} />
					</textbutton>
				) : (
					<textlabel
						Text={`Mode: ${room.mode}`}
						Size={new UDim2(1, 0, 0, 30)}
						TextColor3={Color3.fromRGB(200, 200, 200)}
						BackgroundTransparency={1}
						Font={Enum.Font.Gotham}
						TextSize={20}
					/>
				)}
			</frame>

			{/* Member List */}
			<scrollingframe
				Size={new UDim2(1, 0, 0.6, 0)}
				Position={new UDim2(0, 0, 0, 110)}
				BackgroundTransparency={1}
				ScrollBarThickness={4}
			>
				<uilistlayout Padding={new UDim(0, 10)} />
				{room.members.map((member) => (
					<frame
						key={member.playerId}
						Size={new UDim2(1, 0, 0, 50)}
						BackgroundColor3={Color3.fromRGB(60, 60, 60)}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />
						<uipadding PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 10)} />

						<textlabel
							Text={member.displayName}
							Size={new UDim2(0.7, 0, 1, 0)}
							TextXAlignment="Left"
							BackgroundTransparency={1}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.Gotham}
							TextSize={20}
						/>

						<frame
							Size={new UDim2(0, 12, 0, 12)}
							Position={new UDim2(1, -12, 0.5, -6)}
							BackgroundColor3={
								member.isReady ? Color3.fromRGB(0, 255, 0) : Color3.fromRGB(255, 0, 0)
							}
						>
							<uicorner CornerRadius={new UDim(1, 0)} />
						</frame>
					</frame>
				))}
			</scrollingframe>

			{/* Actions */}
			<frame Size={new UDim2(1, 0, 0, 120)} Position={new UDim2(0, 0, 1, -120)} BackgroundTransparency={1}>
				<textbutton
					Text={localMember?.isReady ? "NOT READY" : "READY"}
					Size={new UDim2(0.45, 0, 0, 50)}
					BackgroundColor3={
						localMember?.isReady ? Color3.fromRGB(200, 100, 100) : Color3.fromRGB(100, 200, 100)
					}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={Enum.Font.GothamBold}
					TextSize={22}
					Event={{ Activated: () => onReady(!localMember?.isReady) }}
				>
					<uicorner CornerRadius={new UDim(0, 8)} />
				</textbutton>

				{isHost && (
					<textbutton
						Text="LAUNCH"
						Size={new UDim2(0.45, 0, 0, 50)}
						Position={new UDim2(0.55, 0, 0, 0)}
						BackgroundColor3={
							canLaunch ? Color3.fromRGB(0, 200, 0) : Color3.fromRGB(80, 80, 80)
						}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={Enum.Font.GothamBold}
						TextSize={22}
						AutoButtonColor={canLaunch}
						Event={{ Activated: () => canLaunch && onLaunch() }}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />
					</textbutton>
				)}

				<textbutton
					Text="LEAVE PARTY"
					Size={new UDim2(1, 0, 0, 40)}
					Position={new UDim2(0, 0, 1, -40)}
					BackgroundColor3={Color3.fromRGB(200, 50, 50)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={Enum.Font.Gotham}
					TextSize={18}
					Event={{ Activated: onLeave }}
				>
					<uicorner CornerRadius={new UDim(0, 6)} />
				</textbutton>
			</frame>
		</frame>
	);
}

import React from "@rbxts/react";
import { PartyRoom, MissionMode } from "shared/domain/party/party-types";

interface PartyPanelProps {
	room: PartyRoom;
	isHost: boolean;
	localPlayerId: string;
	onReady: (ready: boolean) => void;
	onLaunch: () => void;
	onSetMode: (mode: MissionMode) => void;
	onSetDifficulty: (diff: number) => void;
	onLeave: () => void;
	onSelectMerc: () => void;
}

export function PartyPanel({ room, isHost, localPlayerId, onReady, onLaunch, onSetMode, onSetDifficulty, onLeave, onSelectMerc }: PartyPanelProps) {
	const localMember = room.members.find((m) => m.playerId === localPlayerId);
	const hasSelectedMerc = localMember?.selectedMercenaryId !== undefined;
	const canReady = hasSelectedMerc;
	const canLaunch = isHost && room.members.every((m) => m.isReady && m.selectedMercenaryId !== undefined);

	return (
		<frame
			Size={new UDim2(0, 300, 1, 0)}
			Position={new UDim2(1, -300, 0, 0)}
			BackgroundColor3={Color3.fromRGB(40, 40, 40)}
			BorderSizePixel={0}
			ZIndex={10}
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

			{/* Difficulty Selector */}
			<frame Size={new UDim2(1, 0, 0, 40)} Position={new UDim2(0, 0, 0, 100)} BackgroundTransparency={1}>
				<textlabel
					Text={`Difficulty: ${room.difficulty}`}
					Size={new UDim2(0.6, 0, 1, 0)}
					Position={new UDim2(0.2, 0, 0, 0)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					Font={Enum.Font.GothamBold}
					TextSize={20}
				/>
				{isHost && (
					<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
						<textbutton
							Text="<"
							Size={new UDim2(0.2, 0, 1, 0)}
							Position={new UDim2(0, 0, 0, 0)}
							BackgroundColor3={Color3.fromRGB(60, 60, 60)}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							TextSize={20}
							Event={{
								Activated: () => onSetDifficulty(math.max(1, room.difficulty - 1)),
							}}
						>
							<uicorner CornerRadius={new UDim(0, 6)} />
						</textbutton>
						<textbutton
							Text=">"
							Size={new UDim2(0.2, 0, 1, 0)}
							Position={new UDim2(0.8, 0, 0, 0)}
							BackgroundColor3={Color3.fromRGB(60, 60, 60)}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							TextSize={20}
							Event={{
								Activated: () => onSetDifficulty(math.min(5, room.difficulty + 1)),
							}}
						>
							<uicorner CornerRadius={new UDim(0, 6)} />
						</textbutton>
					</frame>
				)}
			</frame>

			{/* Member List */}
			<scrollingframe
				Size={new UDim2(1, 0, 0.45, 0)}
				Position={new UDim2(0, 0, 0, 150)}
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
							Text={`${member.displayName}${member.playerId === localPlayerId ? " (YOU)" : ""}${room.hostId === member.playerId ? " [HOST]" : ""}`}
							Size={new UDim2(0.7, 0, 0.6, 0)}
							TextXAlignment="Left"
							BackgroundTransparency={1}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							TextSize={18}
						/>

						<textlabel
							Text={member.selectedMercenaryId ? member.selectedMercenaryId.upper() : "PENDING..."}
							Size={new UDim2(0.7, 0, 0.4, 0)}
							Position={new UDim2(0, 0, 0.6, 0)}
							TextXAlignment="Left"
							BackgroundTransparency={1}
							TextColor3={member.selectedMercenaryId ? Color3.fromRGB(150, 200, 255) : Color3.fromRGB(150, 150, 150)}
							Font={Enum.Font.Gotham}
							TextSize={14}
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
					Text={localMember?.isReady ? "NOT READY" : (hasSelectedMerc ? "READY" : "SELECT MERC")}
					Size={new UDim2(0.45, 0, 0, 50)}
					BackgroundColor3={
						localMember?.isReady
							? Color3.fromRGB(200, 100, 100)
							: (hasSelectedMerc ? Color3.fromRGB(100, 200, 100) : Color3.fromRGB(255, 180, 50))
					}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={Enum.Font.GothamBold}
					TextSize={22}
					AutoButtonColor={true}
					Event={{
						Activated: () => {
							if (!hasSelectedMerc) {
								onSelectMerc();
							} else {
								onReady(!localMember?.isReady);
							}
						}
					}}
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

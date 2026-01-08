import React from "@rbxts/react";
import { PartyRoom } from "shared/domain/party/party-types";

interface LobbyBillboardProps {
	room: PartyRoom;
	adornee?: BasePart;
}

export function LobbyBillboard({ room, adornee }: LobbyBillboardProps) {
	return (
		<billboardgui
			Size={new UDim2(0, 200, 0, 100)}
			Adornee={adornee}
			StudsOffset={new Vector3(0, 5, 0)}
			AlwaysOnTop={true}
			MaxDistance={50}
		>
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
				<textlabel
					Text={`PARTY CODE: ${room.code}`}
					Size={new UDim2(1, 0, 0, 40)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={0.5}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					TextSize={24}
					Font={Enum.Font.GothamBold}
				>
					<uicorner CornerRadius={new UDim(0, 8)} />
				</textlabel>
				
				<frame Size={new UDim2(1, 0, 0, 60)} Position={new UDim2(0, 0, 0, 45)} BackgroundTransparency={1}>
					<uilistlayout HorizontalAlignment="Center" Padding={new UDim(0, 2)} />
					{room.members.map((m) => (
						<textlabel
							key={m.playerId}
							Text={`${m.displayName} ${m.isReady ? "✅" : ""}`}
							Size={new UDim2(1, 0, 0, 15)}
							TextColor3={m.isOnPad ? Color3.fromRGB(100, 255, 100) : Color3.fromRGB(200, 200, 200)}
							BackgroundTransparency={1}
							TextSize={14}
							Font={Enum.Font.Gotham}
						/>
					))}
				</frame>
			</frame>
		</billboardgui>
	);
}
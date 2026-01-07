import React from "@rbxts/react";
import { MissionMode } from "../../shared/domain/run";

interface LoadoutSelectProps {
	selectedMode: MissionMode;
	onModeChanged: (mode: MissionMode) => void;
}

export function LoadoutSelect(props: LoadoutSelectProps) {
	return (
		<frame Size={new UDim2(0, 300, 0, 100)} Position={new UDim2(0.5, -150, 0.5, -50)}>
			<textlabel 
				Text={`Selected Mode: ${props.selectedMode}`} 
				Size={new UDim2(1, 0, 0.5, 0)} 
			/>
			<textbutton 
				Text="Toggle Ironman" 
				Size={new UDim2(1, 0, 0.5, 0)} 
				Position={new UDim2(0, 0, 0.5, 0)}
				Event={{
					MouseButton1Click: () => {
						props.onModeChanged(props.selectedMode === "Standard" ? "Ironman" : "Standard");
					}
				}}
			/>
		</frame>
	);
}
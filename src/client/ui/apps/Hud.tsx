import React, { useState, useEffect } from "@rbxts/react";
import { AppState } from "client/ui/state/app-state";

export function Hud() {
	const [health, setHealth] = useState(AppState.health);

	useEffect(() => {
		// Poll for changes for this MVP. In real app, subscribe to an event.
		const connection = game.GetService("RunService").Heartbeat.Connect(() => {
			if (AppState.health !== health) {
				setHealth(AppState.health);
			}
		});
		return () => connection.Disconnect();
	}, [health]);

	return (
		<frame
			key="Hud"
			Size={new UDim2(0, 200, 0, 50)}
			Position={new UDim2(0, 20, 1, -70)}
			BackgroundColor3={new Color3(0, 0, 0)}
			BackgroundTransparency={0.5}
		>
			<textlabel
				key="HealthText"
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundTransparency={1}
				TextColor3={new Color3(1, 1, 1)}
				Text={`Health: ${health}`}
				TextSize={24}
			/>
		</frame>
	);
}
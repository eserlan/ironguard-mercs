import React from "@rbxts/react";
import { Hud } from "./Hud";

export function App() {
	return (
		<frame
			Size={new UDim2(1, 0, 1, 0)}
			BackgroundTransparency={1}
			key="AppContainer"
		>
			<Hud />
		</frame>
	);
}
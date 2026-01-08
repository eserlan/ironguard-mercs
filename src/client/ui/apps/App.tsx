import React from "@rbxts/react";
import { Hud } from "./Hud";
import { Lobby } from "./Lobby";
import { useRun } from "client/ui/hooks/useRun";
import { MatchPhase } from "shared/domain/run";

export function App() {
	const { phase } = useRun();

	return (
		<frame
			Size={new UDim2(1, 0, 1, 0)}
			BackgroundTransparency={1}
			key="AppContainer"
		>
			{phase === MatchPhase.Lobby ? <Lobby /> : <Hud />}
		</frame>
	);
}

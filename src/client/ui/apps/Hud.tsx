import React, { useState, useEffect } from "@rbxts/react";
import { AppState } from "client/ui/state/app-state";
import { AbilityBar } from "../AbilityBar";
import { useLobby } from "../hooks/useLobby";

export function Hud() {
	const [health, setHealth] = useState(AppState.health);
	const { state } = useLobby();

	useEffect(() => {
		// Subscribe to AppState changes for proper React updates
		const unsubscribe = AppState.subscribe((state) => {
			setHealth(state.health);
		});
		return unsubscribe;
	}, []);

	return (
		<frame
			Size={new UDim2(1, 0, 1, 0)}
			BackgroundTransparency={1}
		>
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

			<AbilityBar loadout={state.abilityLoadout} />
		</frame>
	);
}
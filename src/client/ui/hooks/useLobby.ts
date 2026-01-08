import { Dependency } from "@flamework/core";
import { useEffect, useState } from "@rbxts/react";
import { LobbyController, LobbyUiState } from "client/controllers/LobbyController";

export function useLobby() {
	const controller = Dependency<LobbyController>();
	const [state, setState] = useState<LobbyUiState>(controller.getState());

	useEffect(() => {
		const unsubscribe = controller.subscribe((newState) => {
			setState(newState);
		});
		return () => { unsubscribe(); };
	}, []);

	return {
		state,
		controller,
	};
}

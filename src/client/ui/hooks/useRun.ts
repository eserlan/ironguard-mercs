import { Dependency } from "@flamework/core";
import { useEffect, useState } from "@rbxts/react";
import { RunController } from "client/controllers/RunController";
import { MatchPhase } from "shared/domain/run";

export function useRun() {
	const controller = Dependency<RunController>();
	const [phase, setPhase] = useState<MatchPhase>(controller.getPhase());

	useEffect(() => {
		const unsubscribe = controller.subscribe((newState) => {
			setPhase(newState.phase);
		});
		return () => { unsubscribe(); };
	}, []);

	return {
		phase,
		controller,
	};
}

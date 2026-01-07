import { Roster } from "../domain/roster";
import { MissionMode } from "../domain/run";

export function resolveMissionDeath(roster: Roster, mercId: string, mode: MissionMode): Roster {
	if (mode !== "Ironman") {
		return roster; // No permadeath in Standard mode
	}

	const index = roster.mercenaries.findIndex(m => m.id === mercId);
	if (index !== -1) {
		const newMercs = [...roster.mercenaries];
		newMercs.splice(index, 1);
		return {
			...roster,
			mercenaries: newMercs
		};
	}

	return roster;
}

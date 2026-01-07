import { MissionMode } from "../domain/run";

export interface RewardResult {
	gold: number;
	xp: number;
}

export function calculateMissionRewards(baseGold: number, baseXp: number, mode: MissionMode): RewardResult {
	const multiplier = mode === "Ironman" ? 1.5 : 1.0;
	return {
		gold: Math.floor(baseGold * multiplier),
		xp: Math.floor(baseXp * multiplier)
	};
}
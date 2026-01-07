import { MissionMode } from "../domain/run";

export interface RewardResult {
	gold: number;
	xp: number;
}

/**
 * Calculates the final mission rewards (gold and XP) from base values, adjusted by the mission mode.
 *
 * The reward multiplier is 1.5× when the mission mode is "Ironman" and 1.0× (no change) for "Standard" missions.
 * The resulting gold and XP values are rounded down to the nearest whole number.
 *
 * @param baseGold - The base amount of gold awarded before applying the mode multiplier.
 * @param baseXp - The base amount of experience awarded before applying the mode multiplier.
 * @param mode - The mission mode, which determines the reward multiplier (1.5× for Ironman, 1.0× for Standard).
 * @returns A {@link RewardResult} containing the final gold and XP amounts after applying the multiplier.
 */
export function calculateMissionRewards(baseGold: number, baseXp: number, mode: MissionMode): RewardResult {
	const multiplier = mode === "Ironman" ? 1.5 : 1.0;
	return {
		gold: math.floor(baseGold * multiplier),
		xp: math.floor(baseXp * multiplier)
	};
}
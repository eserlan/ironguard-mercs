export function getXPThreshold(level: number): number {
	// 1000 * 1.2 ^ (level - 1)
	return math.floor(1000 * math.pow(1.2, level - 1));
}

export function calculateTeamLevelProgress(currentXP: number, level: number): { percent: number; levelUp: boolean } {
	const threshold = getXPThreshold(level);
	return {
		percent: math.min(1, currentXP / threshold),
		levelUp: currentXP >= threshold,
	};
}

export const HARD_CAPS = {
	COOLDOWN_REDUCTION: 0.4, // 40%
	DAMAGE_AMP: 2.0, // 200%
	SPEED_AMP: 1.5, // 150%
};

export function clampStat(stat: keyof typeof HARD_CAPS, value: number): number {
	return math.min(HARD_CAPS[stat], value);
}

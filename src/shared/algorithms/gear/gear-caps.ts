export const GEAR_CAPS = {
	CDR: 0.4, // 40% max
	DMG_AMP: 0.25, // 25% max
	CC_DURATION: 0.3, // 30% max
};

export function clampGearStat(stat: keyof typeof GEAR_CAPS, value: number): number {
	return math.min(GEAR_CAPS[stat], value);
}

export interface PlayerProfile {
	version: number;
	metaLevel: number;
	metaXP: number;
	unlockedClasses: string[];
	unlockedAbilities: string[];
}

export const INITIAL_PROFILE: PlayerProfile = {
	version: 1,
	metaLevel: 1,
	metaXP: 0,
	unlockedClasses: ["shield-saint"],
	unlockedAbilities: [],
};

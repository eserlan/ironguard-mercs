export interface Mercenary {
	id: string;
	name: string;
	className: string;
	level: number;
	xp: number;
	curHealth: number;
	equippedGear: string[];
}

export interface Roster {
	playerId: string;
	capacity: number;
	mercenaries: Mercenary[];
	currency: Map<string, number>;
}

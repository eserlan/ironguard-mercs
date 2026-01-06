export enum EnemyRole {
	Bruiser = "Bruiser",
	Tank = "Tank",
	Artillery = "Artillery",
	Assassin = "Assassin",
	Controller = "Controller",
	Support = "Support",
	Swarm = "Swarm",
	Hazard = "Hazard",
}

export enum EnemyTier {
	Minion = "Minion",
	Elite = "Elite",
	Champion = "Champion",
	Boss = "Boss",
}

export enum AIPhase {
	Idle = "Idle",
	Engage = "Engage",
	Pressure = "Pressure",
	Recover = "Recover",
	Reposition = "Reposition",
}

export interface EnemyStats {
	hp: number;
	speed: number;
	mitigation: number;
	threatBiasMultiplier: number;
}

export interface MoveTelegraph {
	type: "Circle" | "Cone" | "Line";
	duration: number;
	radius?: number;
	angle?: number;
	length?: number;
}

export interface MoveConfig {
	id: string;
	telegraph: MoveTelegraph;
	interruptible: boolean; // Soft cast
	breakable: boolean; // Hard cast
	cooldown: number;
}

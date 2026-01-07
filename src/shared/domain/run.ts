import { WorldPlan } from "./world";

export type MissionMode = "Standard" | "Ironman";

export interface RunConfig {
	seed: number;
	mode: "ArenaClear";
	missionMode: MissionMode;
	difficulty: number;
}

export enum MatchPhase {
	Lobby = "Lobby",
	Generating = "Generating",
	Spawning = "Spawning",
	Playing = "Playing",
	Ending = "Ending",
	Results = "Results",
}

export type MatchResult = "None" | "Victory" | "Defeat";

export interface MatchState {
	phase: MatchPhase;
	config: RunConfig;
	worldPlan?: WorldPlan;
	startTime: number;
	elapsed: number;
	result: MatchResult;
	wave: number;
	enemiesAlive: number;
}
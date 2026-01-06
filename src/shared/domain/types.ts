export interface RunConfig {
	seed: number;
	mode: "ArenaClear";
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

export interface MatchState {
	phase: MatchPhase;
	wave: number;
	enemiesAlive: number;
}

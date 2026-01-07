import { RNG } from "../rng";
import { RunPerk } from "../../domain/progression/types";

export function resolvePerkChoices(
	globalSeed: number,
	userId: number,
	level: number,
	availablePerks: RunPerk[],
): RunPerk[] {
	// Create sub-seed: seed + userId + level
	const rng = new RNG(globalSeed + userId + level);
	let pool = [...availablePerks];
	const choices: RunPerk[] = [];

	for (let i = 0; i < 3; i++) {
		if (pool.size() === 0) break;
		const idx = rng.range(0, pool.size() - 1);
		choices.push(pool[idx]);
		
		// Manual remove (splice is missing in some environments)
		const nextPool: RunPerk[] = [];
		for (let j = 0; j < pool.size(); j++) {
			if (j !== idx) nextPool.push(pool[j]);
		}
		pool = nextPool;
	}

	return choices;
}

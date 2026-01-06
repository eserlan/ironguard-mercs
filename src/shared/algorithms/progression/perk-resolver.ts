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
	const pool = [...availablePerks];
	const choices: RunPerk[] = [];

	for (let i = 0; i < 3; i++) {
		if (pool.length === 0) break;
		const idx = rng.range(0, pool.length - 1);
		choices.push(pool[idx]);
		pool.splice(idx, 1); // Remove to avoid duplicate choices
	}

	return choices;
}

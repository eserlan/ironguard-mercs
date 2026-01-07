import { Service, OnStart } from "@flamework/core";
import { RNG } from "../../shared/algorithms/rng";

@Service({})
export class DeterministicSeedService implements OnStart {
	private masterSeed = 0;

	onStart() {}

	public setMasterSeed(seed: number) {
		this.masterSeed = seed;
	}

	/**
	 * Creates a derived RNG for a specific purpose.
	 * Using a string salt ensures different subsystems get different
	 * sequences from the same master seed.
	 */
	public createRNG(salt: string): RNG {
		const saltHash = this.hashString(salt);
		return new RNG(this.masterSeed ^ saltHash);
	}

	private hashString(s: string): number {
		let hash = 0;
		for (let i = 1; i <= s.size(); i++) {
			const char = string.byte(s, i)[0] ?? 0;
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32bit int
		}
		return hash;
	}
}

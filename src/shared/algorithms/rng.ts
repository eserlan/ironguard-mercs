/**
 * Deterministic RNG (LCG)
 * Portable between Roblox and Node.js for testing.
 */
export class RNG {
	private state: number;

	constructor(seed: number) {
		this.state = seed;
	}

	public next(): number {
		// Linear Congruential Generator (glibc params)
		this.state = (1103515245 * this.state + 12345) % 2147483648;
		const result = this.state / 2147483648;
		return result < 0 ? -result : result;
	}

	/**
	 * Returns integer [min, max] inclusive
	 */
	public range(min: number, max: number): number {
		const r = this.next();
		return math.floor(r * (max - min + 1)) + min;
	}
}

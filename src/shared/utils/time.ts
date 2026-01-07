/**
 * Portable time utility that works in both Roblox and Node.js (Vitest).
 */
export function getTime(): number {
	// In roblox-ts, 'os' is a global but it will throw ReferenceError in Node if accessed directly.
	// We use globalThis to safely check for its existence.
	const global = globalThis as unknown as { os?: { time: () => number } };

	if (global.os !== undefined) {
		return global.os.time();
	}

	return Math.floor(Date.now() / 1000);
}

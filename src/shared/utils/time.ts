/**
 * Portable time utility that works in both Roblox and Node.js (Vitest).
 */
export function getTime(): number {
	// In Roblox, 'os' is a global. In Node.js, it's not.
	if (typeof os !== "undefined" && os.time) {
		return os.time();
	}
	return Math.floor(Date.now() / 1000);
}

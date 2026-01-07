/**
 * Returns current time in seconds (Unix timestamp).
 * Uses Roblox os.time() global.
 */
export function getTime(): number {
	return os.time();
}

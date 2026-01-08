/**
 * Returns current time in seconds (Unix timestamp).
 * Unified utility to prevent transpilation bugs with os.time().
 */
export function getTime(): number {
	return os.time();
}

/**
 * Returns high-resolution time in seconds.
 * Unified utility to prevent transpilation bugs with os.clock().
 */
export function getClock(): number {
	return os.clock();
}

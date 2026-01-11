export const Log = {
	info: (msg: string, ctx?: unknown) => print(`[INFO] ${msg}`, ctx ?? ""),
	warn: (msg: string, ctx?: unknown) => warn(`[WARN] ${msg}`, ctx ?? ""),
	error: (msg: string, ctx?: unknown) => warn(`[ERROR] ${msg}`, ctx ?? ""),
	debug: (msg: string, ctx?: unknown) => print(`[DEBUG] ${msg}`, ctx ?? ""),
};

export function check(condition: unknown, msg: string): asserts condition {
	if (!condition) {
		throw `[ASSERT FAILED] ${msg}`;
	}
}

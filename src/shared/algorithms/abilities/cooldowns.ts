export class CooldownManager {
	private lastCastTimes = new Map<string, number>();

	public canCast(key: string, cooldown: number, now: number): boolean {
		const last = this.lastCastTimes.get(key) || 0;
		return now >= last + cooldown;
	}

	public setCast(key: string, now: number) {
		this.lastCastTimes.set(key, now);
	}

	public getRemaining(key: string, cooldown: number, now: number): number {
		const last = this.lastCastTimes.get(key) || 0;
		return math.max(0, last + cooldown - now);
	}
}

export class SlotCooldownManager {
	private expirationMap = new Map<string, number>();

	public canCast(playerId: string, slotIndex: number, now: number): boolean {
		const expiresAt = this.expirationMap.get(`${playerId}_${slotIndex}`) || 0;
		return now >= expiresAt;
	}

	public setCooldown(playerId: string, slotIndex: number, now: number, duration: number) {
		this.expirationMap.set(`${playerId}_${slotIndex}`, now + duration);
	}

	public getRemaining(playerId: string, slotIndex: number, now: number): number {
		const expiresAt = this.expirationMap.get(`${playerId}_${slotIndex}`) || 0;
		return math.max(0, expiresAt - now);
	}
}

export class BreakMeterLogic {
	private currentValue = 0;
	private staggerDurationRemaining = 0;

	constructor(
		private threshold: number,
		private decayRate: number,
	) {}

	public addImpact(amount: number, isBreaker: boolean): { broken: boolean } {
		if (this.staggerDurationRemaining > 0) return { broken: false };

		this.currentValue += amount;
		if (this.currentValue >= this.threshold) {
			if (isBreaker) {
				this.currentValue = 0;
				return { broken: true };
			} else {
				// Cap at threshold until a breaker hit arrives
				this.currentValue = this.threshold;
			}
		}
		return { broken: false };
	}

	public update(dt: number) {
		if (this.staggerDurationRemaining > 0) {
			this.staggerDurationRemaining = math.max(0, this.staggerDurationRemaining - dt);
		} else {
			this.currentValue = math.max(0, this.currentValue - this.decayRate * dt);
		}
	}

	public triggerStagger(duration: number) {
		this.staggerDurationRemaining = duration;
		this.currentValue = 0;
	}

	public isStaggered(): boolean {
		return this.staggerDurationRemaining > 0;
	}

	public getPercent(): number {
		return math.min(1, this.currentValue / this.threshold);
	}
}

export class HealthLogic {
	public shield = 0;

	constructor(
		public current: number,
		public max: number,
	) { }

	damage(amount: number): boolean {
		if (this.shield > 0) {
			const absorbed = math.min(this.shield, amount);
			this.shield -= absorbed;
			amount -= absorbed;
		}

		if (amount <= 0) return false;

		this.current = math.max(0, this.current - amount);
		return this.current <= 0;
	}

	heal(amount: number) {
		this.current = math.min(this.max, this.current + amount);
	}

	addShield(amount: number) {
		this.shield += amount;
	}
}

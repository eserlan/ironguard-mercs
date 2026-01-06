export class HealthLogic {
	constructor(
		public current: number,
		public max: number,
	) {}

	damage(amount: number): boolean {
		this.current = math.max(0, this.current - amount);
		return this.current <= 0;
	}
}

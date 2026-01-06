export interface ThreatBias {
	value: number;
	expiresAt: number;
}

export class ThreatBiasModel {
	private biases = new Map<string, ThreatBias>(); // key: casterId

	public addBias(casterId: string, amount: number, duration: number, now: number) {
		const current = this.biases.get(casterId) || { value: 0, expiresAt: 0 };
		// Stack and refresh
		this.biases.set(casterId, {
			value: current.value + amount,
			expiresAt: now + duration,
		});
	}

	public getBias(casterId: string, now: number): number {
		const data = this.biases.get(casterId);
		if (!data || now >= data.expiresAt) return 0;
		return data.value;
	}
}

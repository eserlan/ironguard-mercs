export interface ThreatBias {
	value: number;
	expiresAt: number;
}

/**
 * Special bias value used to indicate a character is untargetable.
 * This extremely negative value ensures the character won't be selected as a target.
 */
const UNTARGETABLE_BIAS_VALUE = -1000000;

export class ThreatBiasModel {
	private biases = new Map<string, ThreatBias>(); // key: casterId
	private untargetableUntil = new Map<string, number>();

	public addBias(casterId: string, amount: number, duration: number, now: number) {
		const current = this.biases.get(casterId) || { value: 0, expiresAt: 0 };
		// Stack and refresh
		this.biases.set(casterId, {
			value: current.value + amount,
			expiresAt: now + duration,
		});
	}

	public setUntargetable(casterId: string, duration: number, now: number) {
		this.untargetableUntil.set(casterId, now + duration);
	}

	public getBias(casterId: string, now: number): number {
		const untargetableExpiry = this.untargetableUntil.get(casterId);
		if (untargetableExpiry && now < untargetableExpiry) return UNTARGETABLE_BIAS_VALUE;

		const data = this.biases.get(casterId);
		if (!data || now >= data.expiresAt) return 0;
		return data.value;
	}
}

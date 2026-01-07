import { Service } from "@flamework/core";

@Service({})
export class CombatValidation {
	/**
	 * Validates distance between attacker and target.
	 */
	public validateDistance(attackerPos: Vector3, targetPos: Vector3, maxRange: number): boolean {
		const distance = attackerPos.Sub(targetPos).Magnitude;
		// Allow 10% buffer for latency/interpolation
		return distance <= maxRange * 1.1;
	}

	/**
	 * Validates if the intent is within a reasonable time window.
	 */
	public validateTimestamp(intentTime: number, serverTime: number): boolean {
		return math.abs(serverTime - intentTime) <= 1.0;
	}

	/**
	 * Validates if a dash intent is allowed.
	 */
	public validateDash(lastDash: number, cooldown: number, serverTime: number): boolean {
		return serverTime - lastDash >= cooldown;
	}

	/**
	 * Determines if a combatant is currently invulnerable due to I-frames.
	 */
	public isInvulnerable(lastDash: number, iFrameDuration: number, serverTime: number): boolean {
		return serverTime - lastDash <= iFrameDuration;
	}
}

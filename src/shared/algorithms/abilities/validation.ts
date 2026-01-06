import { AbilityIntent, TargetingType, AbilityConfig } from "../../domain/abilities/types";

export function validateAbilityIntent(
	intent: AbilityIntent,
	config: AbilityConfig,
	now: number,
): { valid: boolean; reason?: string } {
	// 1. Time check
	if (math.abs(now - intent.timestamp) > 1.0) return { valid: false, reason: "Stale" };

	// 2. Target check
	if (config.targeting === TargetingType.Entity && !intent.payload.targetId) return { valid: false, reason: "NoTarget" };
	if (config.targeting === TargetingType.Point && !intent.payload.point) return { valid: false, reason: "NoPoint" };

	return { valid: true };
}

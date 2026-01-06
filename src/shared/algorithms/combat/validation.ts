import { CombatIntent } from "../../domain/combat/types";

export function validateIntent(intent: CombatIntent, now: number): boolean {
    // Check timestamp validity (1s window)
    if (math.abs(now - intent.timestamp) > 1.0) return false;
    return true;
}

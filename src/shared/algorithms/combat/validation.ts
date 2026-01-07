import { CombatIntent } from "../../domain/combat/types";

export function validateIntent(intent: CombatIntent, now: number): boolean {
    // Check timestamp validity (1s window)
    const diff = now - intent.timestamp;
    if (diff < -1.0 || diff > 1.0) return false;
    return true;
}

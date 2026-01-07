import { TargetCandidate } from "./target-scoring";

/**
 * Determines if a candidate is isolated (defined for MVP as more than 30 units from nearest ally).
 * @param candidatePos Position of the candidate.
 * @param allyPositions Positions of other allies.
 * @returns True if isolated.
 */
export function isIsolated(candidatePos: Vector3, allyPositions: Vector3[]): boolean {
    for (const pos of allyPositions) {
        if (candidatePos.Sub(pos).Magnitude < 30) {
            return false;
        }
    }
    return true;
}

/**
 * Determines if a target is at low health (less than 30%).
 * @param current Current HP.
 * @param max Max HP.
 * @returns True if low health.
 */
export function isLowHp(current: number, max: number): boolean {
    if (max <= 0) return false;
    return current / max < 0.3;
}

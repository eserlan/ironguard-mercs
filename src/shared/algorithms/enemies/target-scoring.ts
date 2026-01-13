import { EnemyRole } from "../../domain/enemies/enemy-types";

export interface TargetCandidate {
	id: string;
	distance: number;
	threatBias: number;
	isIsolated: boolean;
	isLowHp: boolean;
}

export function calculateTargetScore(
	role: EnemyRole,
	candidate: TargetCandidate,
): number {
	let score = 0;

	// 1. Proximity (Base)
	score += (100 - math.min(100, candidate.distance)) * 0.5;

	// 2. Threat Bias (Multiplier influence)
	score += candidate.threatBias * 1.5;

	// 3. Role-based weights
	if (role === EnemyRole.Assassin) {
		if (candidate.isIsolated) score += 50;
		if (candidate.isLowHp) score += 30;
	} else if (role === EnemyRole.Artillery) {
		// Artillery prefers clumps (handled outside or via distance/avg pos)
		// For single score, just avoid close targets
		if (candidate.distance < 20) score -= 40;
	}

	return score;
}

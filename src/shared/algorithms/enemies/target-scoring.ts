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
	// Larger falloff (1000 studs) so far-away enemies still have a clear target preference
	score += (1000 - math.min(1000, candidate.distance)) * 0.1;

	// 2. Threat Bias (Multiplier influence)
	score += candidate.threatBias * 1.5;

	// 3. Role-based weights
	if (role === EnemyRole.Assassin) {
		if (candidate.isIsolated) score += 50;
		if (candidate.isLowHp) score += 30;
	} else if (role === EnemyRole.Artillery) {
		if (candidate.distance < 20) score -= 40;
	} else if (role === EnemyRole.Tank) {
		// Tanks prioritize keeping threat (Bias) over distance
		score += candidate.threatBias * 2.0;
	} else if (role === EnemyRole.Bruiser) {
		// Bruisers are simple: stick to the closest target
		score += (50 - math.min(50, candidate.distance)) * 1.0;
	}

	return score;
}

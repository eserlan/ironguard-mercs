import { EnemyRole } from "../../domain/enemies/enemy-types";
import { TargetCandidate } from "./target-scoring";

export interface RoleFloor {
	isMet: (candidate: TargetCandidate) => boolean;
}

export const ROLE_FLOORS: Record<EnemyRole, RoleFloor> = {
	[EnemyRole.Assassin]: {
		isMet: (c) => c.isIsolated || c.isLowHp,
	},
	[EnemyRole.Artillery]: {
		isMet: (c) => c.distance > 25,
	},
	[EnemyRole.Bruiser]: {
		isMet: (c) => c.distance < 15,
	},
	[EnemyRole.Tank]: {
		isMet: (_c) => true, // Tanks are less picky
	},
	[EnemyRole.Controller]: {
		isMet: (c) => !c.isIsolated, // Prefers hitting groups
	},
	[EnemyRole.Support]: {
		isMet: (_c) => true,
	},
	[EnemyRole.Swarm]: {
		isMet: (_c) => true,
	},
	[EnemyRole.Hazard]: {
		isMet: (_c) => true,
	},
};

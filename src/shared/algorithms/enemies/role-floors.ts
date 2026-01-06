import { EnemyRole } from "../../domain/enemies/types";
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
		isMet: (c) => true, // Tanks are less picky
	},
	[EnemyRole.Controller]: {
		isMet: (c) => !c.isIsolated, // Prefers hitting groups
	},
	[EnemyRole.Support]: {
		isMet: (c) => true,
	},
	[EnemyRole.Swarm]: {
		isMet: (c) => true,
	},
	[EnemyRole.Hazard]: {
		isMet: (c) => true,
	},
};

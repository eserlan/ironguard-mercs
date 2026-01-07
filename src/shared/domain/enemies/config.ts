import { EnemyRole, EnemyTier, EnemyStats, MoveConfig } from "./types";

export interface EnemyArchetype {
	id: string;
	name: string;
	role: EnemyRole;
	tier: EnemyTier;
	stats: EnemyStats;
	moves: MoveConfig[];
	breakThreshold: number;
}

export class EnemyRegistry {
	private static archetypes = new Map<string, EnemyArchetype>();

	public static register(config: EnemyArchetype) {
		if (this.archetypes.has(config.id)) {
			throw `Duplicate enemy ID: ${config.id}`;
		}
		this.archetypes.set(config.id, config);
	}

	public static get(id: string): EnemyArchetype | undefined {
		return this.archetypes.get(id);
	}

	public static validate(config: EnemyArchetype): boolean {
		if (!config.id || !config.name) return false;
		if (config.moves.size() === 0) return false;
		if (config.breakThreshold <= 0) return false;
		return true;
	}
}

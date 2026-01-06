import { EnemyStats } from "../../domain/enemies/types";

export enum VariantType {
	Normal = "Normal",
	Armoured = "Armoured",
	Cursed = "Cursed",
	Frost = "Frost",
}

export function applyVariant(stats: EnemyStats, variant: VariantType): EnemyStats {
	const newStats = { ...stats };

	switch (variant) {
		case VariantType.Armoured:
			newStats.mitigation += 20;
			newStats.speed *= 0.8;
			break;
		case VariantType.Cursed:
			newStats.hp *= 0.7;
			// + damage logic handled elsewhere
			break;
		case VariantType.Frost:
			newStats.speed *= 0.7;
			break;
	}

	return newStats;
}

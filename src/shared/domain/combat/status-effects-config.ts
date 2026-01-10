/**
 * Status Effect Configuration
 * Defines status effects and their behaviors in a data-driven manner
 */

export interface StatusEffectDefinition {
	id: string;
	name: string;
	description: string;
	/** Bias value to apply to targeting (if applicable) */
	biasMod?: number;
	/** Whether this effect cleanses other effects */
	isCleanse?: boolean;
	/** Additional custom properties */
	[key: string]: unknown;
}

/**
 * Registry of all status effects
 */
export const StatusEffectRegistry = new Map<string, StatusEffectDefinition>([
	[
		"marked",
		{
			id: "marked",
			name: "Marked",
			description: "Target is marked and takes increased threat",
			biasMod: 50,
		},
	],
	[
		"marked_strong",
		{
			id: "marked_strong",
			name: "Marked (Strong)",
			description: "Target is strongly marked and takes significantly increased threat",
			biasMod: 150,
		},
	],
	[
		"cleanse",
		{
			id: "cleanse",
			name: "Cleanse",
			description: "Removes debuffs from target",
			isCleanse: true,
		},
	],
	[
		"scorch",
		{
			id: "scorch",
			name: "Scorch",
			description: "Burn with mountain heat. Deals fire damage over time.",
			damagePerTick: 10,
			tickInterval: 1,
		},
	],
	[
		"slow",
		{
			id: "slow",
			name: "Slow",
			description: "Hindered movement. 50% speed reduction.",
			speedMod: 0.5,
		},
	],
	[
		"highlighted",
		{
			id: "highlighted",
			name: "Highlighted",
			description: "Revealed to all allies. Reduced evasion.",
			isVisual: true,
		},
	],
	[
		"tether",
		{
			id: "tether",
			name: "Tether",
			description: "Bound to a point. Cannot leave the radius.",
			isRestriction: true,
		},
	],
]);

/**
 * Get a status effect definition by ID
 */
export function getStatusEffect(id: string): StatusEffectDefinition | undefined {
	return StatusEffectRegistry.get(id);
}

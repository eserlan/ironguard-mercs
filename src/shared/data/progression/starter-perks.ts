import { RunPerk, PerkType, PerkRarity } from "../../domain/progression/types";
import { EffectType } from "../../domain/abilities/types";

export const STARTER_PERKS: RunPerk[] = [
	{
		id: "greater-haste",
		name: "Greater Haste",
		type: PerkType.StatNudge,
		rarity: PerkRarity.Common,
		description: "+15% Movement Speed",
		effects: [{ type: EffectType.StatMod, params: { speed: 1.15 } }],
	},
	{
		id: "toughness",
		name: "Toughness",
		type: PerkType.StatNudge,
		rarity: PerkRarity.Common,
		description: "+20 Max Health",
		effects: [{ type: EffectType.StatMod, params: { maxHp: 20 } }],
	},
	{
		id: "shield-bash-augment",
		name: "Stunning Impact",
		type: PerkType.Augment,
		rarity: PerkRarity.Rare,
		description: "Shield Bash now deals +50% Impact Damage.",
		effects: [{ type: EffectType.Augment, params: { abilityId: "bash", impactMult: 1.5 } }],
	},
];

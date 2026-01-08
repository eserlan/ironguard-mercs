import { GearItem, EquipmentSlot, GearType, GearRarity } from "../../domain/gear/types";
import { EffectType } from "../../domain/abilities/types";

export const STARTER_GEAR: GearItem[] = [
	{
		id: "iron-sword",
		name: "Iron Sword",
		slot: EquipmentSlot.Weapon,
		type: GearType.Passive,
		rarity: GearRarity.Common,
		effects: [{ type: EffectType.DamageMod, params: { multiplier: 1.05 } }],
	},
	{
		id: "buckler",
		name: "Buckler",
		slot: EquipmentSlot.Offhand,
		type: GearType.Reactive,
		rarity: GearRarity.Common,
		trigger: "on_block",
		effects: [{ type: EffectType.Shield, params: { amount: 20, duration: 1 } }],
		cooldown: 5,
	},
	{
		id: "plate-armour",
		name: "Plate Armour",
		slot: EquipmentSlot.Armor,
		type: GearType.Passive,
		rarity: GearRarity.Common,
		effects: [{ type: EffectType.MitigationMod, params: { flat: 5 } }],
	},
	{
		id: "healing-salve",
		name: "Healing Salve",
		slot: EquipmentSlot.Utility,
		type: GearType.Consumable,
		rarity: GearRarity.Common,
		effects: [{ type: EffectType.Heal, params: { percent: 0.25 } }],
		maxCharges: 3,
	},
];

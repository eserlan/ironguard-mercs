import { GearItem, EquipmentSlot, GearType, GearRarity } from "../../domain/gear/types";

export const STARTER_GEAR: GearItem[] = [
	{
		id: "iron-sword",
		name: "Iron Sword",
		slot: EquipmentSlot.Weapon,
		type: GearType.Passive,
		rarity: GearRarity.Common,
		effects: [{ type: "DamageMod", params: { multiplier: 1.05 } }],
	},
	{
		id: "buckler",
		name: "Buckler",
		slot: EquipmentSlot.Offhand,
		type: GearType.Reactive,
		rarity: GearRarity.Common,
		trigger: "on_block",
		effects: [{ type: "Shield", params: { amount: 20, duration: 1 } }],
		cooldown: 5,
	},
	{
		id: "plate-armour",
		name: "Plate Armour",
		slot: EquipmentSlot.Armour,
		type: GearType.Passive,
		rarity: GearRarity.Common,
		effects: [{ type: "MitigationMod", params: { flat: 5 } }],
	},
	{
		id: "healing-salve",
		name: "Healing Salve",
		slot: EquipmentSlot.Utility,
		type: GearType.Consumable,
		rarity: GearRarity.Common,
		effects: [{ type: "Heal", params: { percent: 0.25 } }],
		maxCharges: 3,
	},
];

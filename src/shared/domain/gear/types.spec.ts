import { describe, it, expect } from "vitest";
import {
    GearItem,
    EquipmentSlot,
    GearType,
    GearRarity,
    PlayerEquipment,
} from "./types";
import { EffectBlock } from "../abilities/types";

describe("Gear Types", () => {
    describe("EffectBlock integration", () => {
        it("accepts valid EffectBlock array", () => {
            const effects: EffectBlock[] = [
                { type: "Damage", params: { amount: 10, element: "fire" } },
                { type: "StatusApply", params: { status: "burn", duration: 5 } },
            ];

            const gear: GearItem = {
                id: "flame-sword",
                name: "Flame Sword",
                slot: EquipmentSlot.Weapon,
                type: GearType.Passive,
                rarity: GearRarity.Rare,
                effects,
            };

            expect(gear.effects).toHaveLength(2);
            expect(gear.effects[0].type).toBe("Damage");
            expect(gear.effects[1].params.status).toBe("burn");
        });

        it("allows empty effects array", () => {
            const gear: GearItem = {
                id: "blank-shield",
                name: "Blank Shield",
                slot: EquipmentSlot.Offhand,
                type: GearType.Passive,
                rarity: GearRarity.Common,
                effects: [],
            };

            expect(gear.effects).toHaveLength(0);
        });

        it("supports reactive gear with trigger", () => {
            const gear: GearItem = {
                id: "counter-ring",
                name: "Ring of Retaliation",
                slot: EquipmentSlot.Utility,
                type: GearType.Reactive,
                rarity: GearRarity.Uncommon,
                trigger: "OnDamageTaken",
                effects: [{ type: "Damage", params: { amount: 5, target: "attacker" } }],
            };

            expect(gear.trigger).toBe("OnDamageTaken");
            expect(gear.effects[0].type).toBe("Damage");
        });

        it("supports active gear with cooldown and charges", () => {
            const gear: GearItem = {
                id: "healing-potion",
                name: "Healing Potion",
                slot: EquipmentSlot.Utility,
                type: GearType.Consumable,
                rarity: GearRarity.Common,
                effects: [{ type: "Heal", params: { amount: 50 } }],
                cooldown: 30,
                maxCharges: 3,
            };

            expect(gear.cooldown).toBe(30);
            expect(gear.maxCharges).toBe(3);
        });

        it("supports class-restricted gear", () => {
            const gear: GearItem = {
                id: "mage-staff",
                name: "Arcane Staff",
                slot: EquipmentSlot.Weapon,
                type: GearType.Active,
                rarity: GearRarity.Exotic,
                effects: [{ type: "SpellPower", params: { bonus: 25 } }],
                classFilter: ["Mage", "Warlock"],
            };

            expect(gear.classFilter).toContain("Mage");
            expect(gear.classFilter).toContain("Warlock");
        });
    });

    describe("PlayerEquipment", () => {
        it("manages equipment slots", () => {
            const equipment: PlayerEquipment = {
                slots: new Map([
                    [EquipmentSlot.Weapon, "iron-sword"],
                    [EquipmentSlot.Armor, "leather-vest"],
                ]),
                sideboard: ["healing-potion", "smoke-bomb"],
            };

            expect(equipment.slots.get(EquipmentSlot.Weapon)).toBe("iron-sword");
            expect(equipment.slots.has(EquipmentSlot.Offhand)).toBe(false);
            expect(equipment.sideboard).toHaveLength(2);
        });
    });
});

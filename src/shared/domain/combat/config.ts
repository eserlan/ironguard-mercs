export enum WeaponType { Melee = "Melee", Hitscan = "Hitscan" }

export interface WeaponConfig {
    id: string;
    type: WeaponType;
    damage: number;
    cooldown: number;
    range: number;
}

export const Weapons: Record<string, WeaponConfig> = {
    "Sword": { id: "Sword", type: WeaponType.Melee, damage: 20, cooldown: 0.5, range: 5 },
    "Rifle": { id: "Rifle", type: WeaponType.Hitscan, damage: 10, cooldown: 0.1, range: 100 },
};

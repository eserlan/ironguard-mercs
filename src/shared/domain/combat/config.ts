export enum WeaponType { Melee = "Melee", Hitscan = "Hitscan", Shield = "Shield" }

export enum WeaponClass {
    Dagger = "Dagger",       // Fast, short range
    Sword = "Sword",         // Balanced
    TwoHander = "TwoHander", // Slow, long range, high impact
}

// Animation speed multipliers per weapon class
export const WeaponClassSpeeds: Record<WeaponClass, number> = {
    [WeaponClass.Dagger]: 1.5,     // 50% faster
    [WeaponClass.Sword]: 1.0,      // Normal speed
    [WeaponClass.TwoHander]: 0.6,  // 40% slower
};

export interface WeaponConfig {
    id: string;
    type: WeaponType;
    damage: number;
    cooldown: number;
    range: number;
    assetId?: number;
    meleeProfile?: MeleeProfile;
}

export interface MeleeProfile {
    animId: string;
    playbackSpeed: number;
    weaponClass: WeaponClass;
    range: number;
    arcDegrees: number;
    impact: number;
    damage: number;
    hitWindow: [number, number];
    canInterruptSoftCasts: boolean;
    canBreakHardCasts: boolean;
}


export const LightSwordSwing: MeleeProfile = {
    animId: "rbxassetid://491560613",
    playbackSpeed: 1.0,
    weaponClass: WeaponClass.Sword,
    range: 7,
    arcDegrees: 90,
    impact: 1,
    damage: 1.0,
    hitWindow: [0.18, 0.32],
    canInterruptSoftCasts: true,
    canBreakHardCasts: false,
};

export const HeavySwordSwing: MeleeProfile = {
    animId: "rbxassetid://HEAVY_SWING_ID", // Placeholder
    playbackSpeed: 0.8, // Slower but forceful
    weaponClass: WeaponClass.TwoHander, // Uses slower timing multiplier
    range: 9, // Slightly longer range
    arcDegrees: 120, // Wider arc
    impact: 3, // High impact
    damage: 2.0, // Double damage
    hitWindow: [0.4, 0.6], // Later hit window
    canInterruptSoftCasts: true,
    canBreakHardCasts: true, // Can break guards/casts
};

export const Weapons: Record<string, WeaponConfig> = {

    "Sword": { id: "Sword", type: WeaponType.Melee, damage: 20, cooldown: 0.5, range: 5, assetId: 47433 },
    "Rifle": { id: "Rifle", type: WeaponType.Hitscan, damage: 10, cooldown: 0.1, range: 100 },
    "BasicHit": {
        id: "BasicHit",
        type: WeaponType.Melee,
        damage: 15,
        cooldown: 0.4,
        range: 10,
        assetId: 47433,
        meleeProfile: LightSwordSwing
    },
    "HeavyHit": {
        id: "HeavyHit",
        type: WeaponType.Melee,
        damage: 30, // Base 30 * 2.0 profile = 60 dmg effectively? No, damage field in weapon is base. Profile mult applied later.
        cooldown: 1.5,
        range: 12,
        assetId: 47433, // Re-use icon for now
        meleeProfile: HeavySwordSwing
    },
    "BasicBlock": { id: "BasicBlock", type: WeaponType.Shield, damage: 0, cooldown: 0.2, range: 0 },
};


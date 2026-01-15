import { Vec3 } from "../world";

export interface CombatIntent {
    weaponId: string;
    origin: Vec3;
    direction: Vec3;
    timestamp: number;
    action?: "Begin" | "End";
}

export interface CombatStats {
    baseDamage: number;
    synergyMultiplier: number;
    critChance: number;
    critMultiplier: number;
}

export interface DamageResult {
    amount: number;
    isCrit: boolean;
    targetId: string | undefined;
    isFatal: boolean;
}

export interface CombatEvent {
    attackerId: string;
    targetId: string;
    weaponId: string;
    damage: number;
    isCrit: boolean;
    isFatal: boolean;
    timestamp: number;
    position?: Vec3;
}

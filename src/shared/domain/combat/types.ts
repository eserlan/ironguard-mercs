import { Vec3 } from "../world";

export interface CombatIntent {
    weaponId: string;
    origin: Vec3;
    direction: Vec3;
    timestamp: number;
}

export interface DamageResult {
    amount: number;
    isCrit: boolean;
    targetId: string | undefined;
    isFatal: boolean;
}

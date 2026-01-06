export interface StatusEffect {
    id: string;
    duration: number;
    tickInterval?: number;
    damagePerTick?: number;
    statMod?: { stat: string, value: number };
}

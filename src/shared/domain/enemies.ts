export interface EnemyConfig {
    id: string;
    hp: number;
    damage: number;
    speed: number;
}

export const Enemies: Record<string, EnemyConfig> = {
    "Grunt": { id: "Grunt", hp: 100, damage: 10, speed: 16 },
    "Ranged": { id: "Ranged", hp: 60, damage: 15, speed: 12 },
};

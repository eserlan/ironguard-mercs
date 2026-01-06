import { RNG } from "./rng";

export interface Wave {
    enemies: string[]; // Enemy IDs
}

export function createWavePlan(seed: number, difficulty: number): Wave[] {
    const rng = new RNG(seed);
    const waves: Wave[] = [];
    const count = math.floor(difficulty * 3) + 1;
    
    for (let i = 0; i < 3; i++) { // 3 waves
        const wave: Wave = { enemies: [] };
        for (let j = 0; j < count; j++) {
            wave.enemies.push(rng.next() > 0.5 ? "Grunt" : "Ranged");
        }
        waves.push(wave);
    }
    return waves;
}

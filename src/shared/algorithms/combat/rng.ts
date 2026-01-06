import { RNG } from "../../algorithms/rng";

export class CombatRNG {
    private rng: RNG;
    constructor(seed: number) {
        this.rng = new RNG(seed);
    }
    
    rollCrit(chance: number): boolean {
        return this.rng.next() < chance;
    }
}

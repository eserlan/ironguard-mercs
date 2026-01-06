import { WorldPlan, TileDef, Vec3 } from "../domain/world";
import { RNG } from "./rng";

export function createWorldPlan(seed: number): WorldPlan {
	const rng = new RNG(seed); // Seed used for variability later
	const layout: TileDef[] = [];

	// MVP: Single Arena
	layout.push({
		assetId: "Arena_01",
		position: { x: 0, y: 0, z: 0 },
		rotation: 0,
	});

	const playerSpawns: Vec3[] = [{ x: 0, y: 5, z: 0 }];

	// Randomize enemy spawns slightly to prove RNG usage
	const enemySpawns: Vec3[] = [];
	for (let i = 0; i < 3; i++) {
		enemySpawns.push({
			x: rng.range(-20, 20),
			y: 5,
			z: rng.range(-20, 20),
		});
	}

	return { layout, playerSpawns, enemySpawns };
}

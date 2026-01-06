export interface Vec3 {
	x: number;
	y: number;
	z: number;
}

export interface TileDef {
	assetId: string;
	position: Vec3;
	rotation: number; // 0, 90, 180, 270
}

export interface WorldPlan {
	layout: TileDef[];
	playerSpawns: Vec3[];
	enemySpawns: Vec3[];
}

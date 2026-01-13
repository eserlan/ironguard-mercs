import { MonsterPackDef, SpawningEnemy } from "shared/types/SpawningTypes";
import { PackContext } from "./PackContext";
import { ModelPool } from "../utils/ModelPool";

export interface PendingSpawn {
	readonly enemyId: string;
	readonly cframe: CFrame;
	readonly isAmbush: boolean;
}

export class EncounterZone {
	public readonly zoneId: string;
	public status: "Dormant" | "Active" | "Cleared" = "Dormant";
	private activeEnemies = new Map<string, SpawningEnemy>();
	private packs: { def: MonsterPackDef, context: PackContext }[] = [];
	private currentWaveIndex = 0;
	private isLocked = false;
	private pendingSpawns: PendingSpawn[] = [];

	constructor(zoneId: string) {
		this.zoneId = zoneId;
	}

	public AddPack(pack: MonsterPackDef) {
		this.packs.push({ def: pack, context: new PackContext() });
	}

	public RegisterSpawnPoint(enemyId: string, cframe: CFrame, isAmbush: boolean = false) {
		this.pendingSpawns.push({ enemyId, cframe, isAmbush });
	}

	public getPendingSpawns(): readonly PendingSpawn[] {
		return this.pendingSpawns;
	}

	public Activate(_pool: ModelPool) {
		if (this.status !== "Dormant") return;
		this.status = "Active";
		print(`Zone ${this.zoneId} Activated`);

		this.StartWave(_pool);
	}

	public Deactivate(_pool: ModelPool) {
		if (this.status === "Cleared") return;
		this.status = "Dormant";
		print(`Zone ${this.zoneId} Deactivated`);

		// Return all active models to pool
		// In a real implementation, we would map GUID -> Model Instance
		// _pool.Return(model);
		this.activeEnemies.clear();
	}

	private StartWave(_pool: ModelPool) {
		const wave = this.packs[this.currentWaveIndex];
		if (!wave) return;
		this.LockDoors();
	}

	private LockDoors() {
		this.isLocked = true;
		print(`Zone ${this.zoneId} Locked`);
	}

	private UnlockDoors() {
		this.isLocked = false;
		print(`Zone ${this.zoneId} Unlocked`);
	}

	public OnEnemyDeath(guid: string) {
		this.activeEnemies.delete(guid);
		if (this.activeEnemies.size() === 0) {
			this.currentWaveIndex++;
			if (this.currentWaveIndex < this.packs.size()) {
				print(`Zone ${this.zoneId} Wave ${this.currentWaveIndex} Complete`);
			} else {
				this.status = "Cleared";
				this.UnlockDoors();
				print(`Zone ${this.zoneId} Cleared`);
			}
		}
	}
}

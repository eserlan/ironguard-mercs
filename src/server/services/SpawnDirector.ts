import { Service, OnStart, OnInit } from "@flamework/core";
import { AllPacks } from "shared/config/MonsterPacks";
import { MonsterPackDef } from "shared/types/SpawningTypes";
import { EncounterZone } from "../components/EncounterZone";
import { ModelPool } from "../utils/ModelPool";
import { Workspace } from "@rbxts/services";
import { EnemySpawnService } from "./EnemySpawnService";
import { playAmbushCue } from "../utils/AmbushVFX";

@Service({})
export class SpawnDirector implements OnStart, OnInit {
	private zones = new Map<string, EncounterZone>();
	private mapSeed = 0;
	private pool: ModelPool | undefined;

	constructor(private enemySpawnService: EnemySpawnService) { }

	onInit() { }

	onStart() {
		print("SpawnDirector started");
		const template = new Instance("Model");
		const part = new Instance("Part");
		part.Parent = template;
		this.pool = new ModelPool(template, 50, Workspace);
	}

	public ScanMap(dungeonRoot: Instance, seed: number) {
		this.mapSeed = seed;
		for (const room of dungeonRoot.GetChildren()) {
			if (room.IsA("Model")) {
				this.processRoom(room);
			}
		}
	}

	private processRoom(room: Model) {
		const spots: BasePart[] = [];
		const descendants = room.GetDescendants();
		for (const child of descendants) {
			if (child.IsA("BasePart") && child.Name === "EnemySpot") {
				spots.push(child);
			}
		}

		if (spots.size() === 0) return;

		const zone = new EncounterZone(room.Name);
		this.zones.set(room.Name, zone);

		// Read budget/biome from room attributes, with sensible defaults
		const budget = (room.GetAttribute("RoomBudget") as number) ?? 20;
		const biome = (room.GetAttribute("Biome") as string) ?? "Forest";

		const rng = this.getDeterministicRandom(room.Name);
		const pack = this.SelectPack(budget, biome, rng);

		if (pack) {
			zone.AddPack(pack);
			this.AssignSpots(zone, pack, spots, rng);
		}

		// Create zone trigger volume
		this.createZoneTrigger(room, zone);
	}

	private createZoneTrigger(room: Model, zone: EncounterZone) {
		// Use room's bounding box for trigger volume
		const size = room.GetExtentsSize();
		const cf = room.GetPivot();

		const trigger = new Instance("Part");
		trigger.Name = `ZoneTrigger_${zone.zoneId}`;
		trigger.Size = size;
		trigger.CFrame = cf;
		trigger.Anchored = true;
		trigger.CanCollide = false;
		trigger.Transparency = 1;
		trigger.Parent = room;

		// Connect touch detection
		trigger.Touched.Connect((hit) => {
			const player = game.GetService("Players").GetPlayerFromCharacter(hit.Parent);
			if (player && zone.status === "Dormant") {
				this.ActivateZone(zone.zoneId);
			}
		});
	}

	public getDeterministicRandom(salt: string): Random {
		let hash = this.mapSeed;
		for (let i = 0; i < salt.size(); i++) {
			const [char] = string.byte(salt, i + 1);
			hash = (hash + char) % 2147483647;
		}
		return new Random(hash);
	}

	public SelectPack(budget: number, biome: string, rng: Random): MonsterPackDef | undefined {
		const candidates = AllPacks.filter((p) =>
			p.budgetCost <= budget &&
			p.biomeTags.includes(biome)
		);

		if (candidates.size() === 0) return undefined;

		const index = rng.NextInteger(0, candidates.size() - 1);
		return candidates[index];
	}

	public AssignSpots(zone: EncounterZone, pack: MonsterPackDef, spots: BasePart[], rng: Random) {
		const availableSpots = [...spots];

		for (const member of pack.members) {
			const count = rng.NextInteger(member.count.Min, member.count.Max);
			for (let i = 0; i < count; i++) {
				if (availableSpots.size() === 0) break;

				const spotIndex = rng.NextInteger(0, availableSpots.size() - 1);
				const spot = availableSpots[spotIndex];
				availableSpots.remove(spotIndex);

				// Check if spot is marked as ambush
				const isAmbush = spot.GetAttribute("IsAmbush") === true;

				// Register spawn point with zone for later instantiation
				zone.RegisterSpawnPoint(member.enemyId, spot.CFrame, isAmbush);
			}
		}
	}

	public ActivateZone(zoneId: string) {
		const zone = this.zones.get(zoneId);
		if (!zone || zone.status !== "Dormant") return;

		zone.status = "Active";
		print(`Zone ${zoneId} Activated`);

		// Spawn all pending enemies
		for (const spawn of zone.getPendingSpawns()) {
			if (spawn.isAmbush) {
				// Async spawn with VFX delay
				task.spawn(() => {
					playAmbushCue(spawn.cframe).then(() => {
						this.enemySpawnService.spawnEnemy(spawn.enemyId, spawn.cframe);
					});
				});
			} else {
				// Immediate spawn
				this.enemySpawnService.spawnEnemy(spawn.enemyId, spawn.cframe);
			}
		}

		this.ApplyScaling(zone);
	}

	public DeactivateZone(zoneId: string) {
		const zone = this.zones.get(zoneId);
		if (zone && this.pool) {
			zone.Deactivate(this.pool);
		}
	}

	private ApplyScaling(zone: EncounterZone) {
		const dungeonLevel = 1;
		const multiplier = 1 + (dungeonLevel * 0.1);
		print(`Applied scaling ${multiplier}x to zone ${zone.zoneId}`);
	}
}
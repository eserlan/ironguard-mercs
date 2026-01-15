import { Service, OnStart, OnInit } from "@flamework/core";
import { AllPacks } from "shared/config/MonsterPacks";
import { MonsterPackDef } from "shared/types/SpawningTypes";
import { EncounterZone } from "../components/EncounterZone";
import { ModelPool } from "../utils/ModelPool";
import { Workspace } from "@rbxts/services";
import { EnemySpawnService } from "./EnemySpawnService";
import { playAmbushCue } from "../utils/AmbushVFX";
import { DungeonGraph, GraphNode } from "shared/algorithms/dungeon-gen";

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

	public populateDungeon(graph: DungeonGraph, seed: number) {
		this.mapSeed = seed;
		for (const node of graph.nodes) {
			this.processNode(node);
		}
	}

	private processNode(node: GraphNode) {
		if (node.tags.includes("StartRoom")) return;

		// 1. Calculate Budget (Difficulty based on distance)
		const budget = this.calculateRoomBudget(node);
		const biome = "Dungeon"; // Hardcode biome for now, can be extracted from tags later

		// 2. Select Pack Deterministically
		const rng = this.getDeterministicRandom(node.id);
		const pack = this.SelectPack(budget, biome, rng);

		if (pack) {
			node.encounterPackId = pack.id;
			node.monsterBudget = budget;
		}
	}

	public registerRoomEncounter(room: Model, node: GraphNode) {
		const spots = this.findEnemySpots(room);

		if (spots.size() === 0) {
			print(`[SpawnDirector] No spawn spots found in room ${node.id} (${node.tileId}), skipping encounter registration`);
			return;
		}

		print(`[SpawnDirector] Registering encounter for room ${node.id} with ${spots.size()} spots`);
		const zone = new EncounterZone(node.id);
		this.zones.set(node.id, zone);

		if (node.encounterPackId) {
			const pack = AllPacks.find(p => p.id === node.encounterPackId);
			if (pack) {
				print(`[SpawnDirector] Assigning pack ${pack.id} to room ${node.id}`);
				const rng = this.getDeterministicRandom(node.id + "_spots");
				zone.AddPack(pack);
				this.AssignSpots(zone, pack, spots, rng);
			} else {
				print(`[SpawnDirector] Warning: Pack ${node.encounterPackId} not found for room ${node.id}`);
			}
		}

		// Create zone trigger volume
		this.createZoneTrigger(room, zone);
	}

	private findEnemySpots(room: Model): BasePart[] {
		const spots: BasePart[] = [];
		for (const child of room.GetDescendants()) {
			if ((child.Name === "EnemySpot" || child.Name === "BossSpawn") && child.IsA("BasePart")) {
				spots.push(child);
			}
		}
		return spots;
	}

	private calculateRoomBudget(node: GraphNode): number {
		// Linear scaling based on distance from start
		// Min 10, Max 50, +5 per distance step
		const baseBudget = 10;
		const distanceScale = 5;
		return math.min(50, baseBudget + (node.distanceFromStart * distanceScale));
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
		print(`[SpawnDirector] Zone ${zoneId} Activated! Spawning ${zone.getPendingSpawns().size()} enemies.`);

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
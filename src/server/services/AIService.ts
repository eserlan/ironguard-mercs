import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";
import { TargetingBiasService } from "./TargetingBiasService";
import { calculateTargetScore, TargetCandidate } from "../../shared/algorithms/enemies/target-scoring";
import { isIsolated, isLowHp } from "../../shared/algorithms/enemies/targeting-helpers";
import { EnemyRole } from "../../shared/domain/enemies/enemy-types";

@Service({})
export class AIService implements OnStart {
	private enemies = new Set<Model>();

	constructor(private biasService: TargetingBiasService) { }

	onStart() {
		Log.info("AIService initialized");

		// Delay tick loop start to allow Rojo to sync modules
		task.spawn(() => {
			// Wait a few seconds for ReplicatedStorage to fully sync
			task.wait(3);
			Log.info("AIService tick loop starting");

			while (task.wait(0.5)) {
				this.tick();
			}
		});
	}

	public registerEnemy(model: Model) {
		this.enemies.add(model);
		model.Destroying.Connect(() => this.enemies.delete(model));
	}

	private tick() {
		const players = game.GetService("Players").GetPlayers();
		if (players.size() === 0) return;

		const activePlayers: Player[] = [];
		for (const p of players) {
			if (p.Character) activePlayers.push(p);
		}

		if (activePlayers.size() === 0) return;

		const characterPositions: Vector3[] = [];
		for (const p of activePlayers) {
			characterPositions.push(p.Character!.GetPivot().Position);
		}

		for (const enemy of this.enemies) {
			const humanoid = enemy.FindFirstChildOfClass("Humanoid");
			if (!humanoid || humanoid.Health <= 0) continue;

			let bestTarget: Model | undefined;
			let bestScore = -1e308;

			for (const player of activePlayers) {
				const char = player.Character!;
				const pos = char.GetPivot().Position;
				const distance = enemy.GetPivot().Position.sub(pos).Magnitude;

				const neighbors: Vector3[] = [];
				for (const pPos of characterPositions) {
					if (pPos.sub(pos).Magnitude > 0.01) neighbors.push(pPos);
				}

				const candidate: TargetCandidate = {
					id: tostring(player.UserId),
					distance,
					threatBias: this.biasService.getBias(tostring(player.UserId)),
					isIsolated: isIsolated(pos, neighbors),
					isLowHp: isLowHp(
						(char.FindFirstChildOfClass("Humanoid")?.Health) ?? 100,
						(char.FindFirstChildOfClass("Humanoid")?.MaxHealth) ?? 100
					),
				};

				const role = (enemy.GetAttribute("Role") as EnemyRole) ?? EnemyRole.Bruiser;
				const score = calculateTargetScore(role, candidate);

				if (score > bestScore) {
					bestScore = score;
					bestTarget = char;
				}
			}

			if (bestTarget) {
				const humanoid = enemy.FindFirstChildOfClass("Humanoid") as Humanoid;
				if (humanoid) {
					const targetPos = bestTarget.GetPivot().Position;
					const myPos = enemy.GetPivot().Position;
					const distance = targetPos.sub(myPos).Magnitude;

					// Stopping distance: don't stand on top of the player
					// Add a bit of random "personal space" so they don't overlap (6-10 studs)
					const personalSpace = (enemy.GetAttribute("StoppingDistance") as number) ?? (6 + math.random() * 4);
					if (!enemy.GetAttribute("StoppingDistance")) {
						enemy.SetAttribute("StoppingDistance", personalSpace);
					}

					const instanceId = enemy.GetAttribute("InstanceId") ?? "???";
					const nameWithId = `${enemy.Name} [${instanceId}]`;

					if (distance > personalSpace) {
						Log.debug(`[AIService] ${nameWithId} moving to ${bestTarget.Name} (Score: ${math.floor(bestScore)}, Dist: ${math.floor(distance)})`);
						humanoid.MoveTo(targetPos);
					} else {
						Log.debug(`[AIService] ${nameWithId} reached target ${bestTarget.Name}, stopping (Dist: ${math.floor(distance)})`);
						humanoid.MoveTo(myPos); // Stop moving
					}
				}
			} else {
				const instanceId = enemy.GetAttribute("InstanceId") ?? "???";
				Log.debug(`[AIService] ${enemy.Name} [${instanceId}] found no valid targets`);
			}
		}
	}
}
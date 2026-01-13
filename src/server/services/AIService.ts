import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";
import { TargetingBiasService } from "./TargetingBiasService";
import { calculateTargetScore, TargetCandidate } from "../../shared/algorithms/enemies/target-scoring";
import { isIsolated, isLowHp } from "../../shared/algorithms/enemies/targeting-helpers";
import { EnemyRole } from "../../shared/domain/enemies/enemy-types";
import { calculateSeparationForce } from "../../shared/algorithms/enemies/formation-logic";

@Service({})
export class AIService implements OnStart {
	private enemies = new Set<Model>();

	constructor(private biasService: TargetingBiasService) { }

	onStart() {
		// Delay tick loop start to allow Rojo to sync modules
		task.spawn(() => {
			// Wait a few seconds for ReplicatedStorage to fully sync
			task.wait(3);
			// Log.info("AIService tick loop starting"); // Silenced

			while (task.wait(0.1)) { // High-frequency steering (10Hz)
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
					const personalSpace = (enemy.GetAttribute("StoppingDistance") as number) ?? (6 + math.random() * 4);
					if (!enemy.GetAttribute("StoppingDistance")) {
						enemy.SetAttribute("StoppingDistance", personalSpace);
					}

					const instanceId = enemy.GetAttribute("InstanceId") ?? "???";
					const nameWithId = `${enemy.Name} [${instanceId}]`;

					// 1. Calculate Separation Force (Avoidance)
					// Only use horizontal neighbors to avoid vertical interference
					const neighborPositions: Vector3[] = [];
					for (const other of this.enemies) {
						if (other === enemy) continue;
						const otherHumanoid = other.FindFirstChildOfClass("Humanoid");
						if (otherHumanoid && otherHumanoid.Health > 0) {
							neighborPositions.push(other.GetPivot().Position);
						}
					}

					const pursuitDir = targetPos.sub(myPos).Unit;
					const horizontalPursuit = new Vector3(pursuitDir.X, 0, pursuitDir.Z).Unit;

					// 1. Calculate Separation Force (Avoidance)
					// Now includes Tangential Biasing to prevent back-and-forth jitter
					const separationVec = calculateSeparationForce(myPos, neighborPositions, horizontalPursuit);

					// 2. Stable Docking Zone (Hysteresis)
					// If we are within 1.5 studs of our goal, we stop pursuing.
					// This prevents the constant "micro-adjustment" loop.
					const deadzone = 1.5;
					const distError = distance - personalSpace;

					let pursuitStrength = 0;
					if (math.abs(distError) > deadzone) {
						// Ramp pursuit back up once outside the deadzone
						pursuitStrength = math.clamp(distError / 5, -1.0, 1.0);
					}

					// 3. Combined Steering Direction
					const combinedDir = horizontalPursuit.mul(pursuitStrength).add(separationVec).Unit;

					// If we are in the deadzone and there's no major separation push, HOLD POSITION
					if (math.abs(distError) <= deadzone && separationVec.Magnitude < 0.2) {
						humanoid.MoveTo(myPos); // Hard stop
					} else {
						// Reduced look-ahead to 5 studs for tighter responsiveness at 10Hz
						const moveTarget = myPos.add(combinedDir.mul(5));
						humanoid.MoveTo(moveTarget);
					}
				}
			}
			else {
				// No targets found
			}
		}
	}
}
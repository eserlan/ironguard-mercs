import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";
import { TargetingBiasService } from "./TargetingBiasService";
import { calculateTargetScore, TargetCandidate } from "../../shared/algorithms/enemies/target-scoring";
import { isIsolated, isLowHp } from "../../shared/algorithms/enemies/targeting-helpers";
import { EnemyRole } from "../../shared/domain/enemies/types";

@Service({})
export class AIController implements OnStart {
	private enemies = new Set<Model>();

	constructor(private biasService: TargetingBiasService) { }

	onStart() {
		Log.info("AIController initialized");

		task.spawn(() => {
			while (task.wait(1)) {
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

		const playerCharacters = players
			.map((p) => p.Character)
			.filter((c): c is Model => c !== undefined);

		const characterPositions = playerCharacters.map((c) => c.GetPivot().Position);

		this.enemies.forEach((enemy) => {
			let bestTarget: Model | undefined;
			let bestScore = -math.huge;

			playerCharacters.forEach((char) => {
				const pos = char.GetPivot().Position;
				const distance = enemy.GetPivot().Position.Sub(pos).Magnitude;

				const candidate: TargetCandidate = {
					id: tostring(char.Name),
					distance,
					threatBias: this.biasService.getBias(tostring(char.Name)),
					isIsolated: isIsolated(pos, characterPositions.filter(p => !p.IsClose(pos, 0.01))),
					isLowHp: isLowHp(
						char.FindFirstChildOfClass("Humanoid")?.Health ?? 100,
						char.FindFirstChildOfClass("Humanoid")?.MaxHealth ?? 100
					),
				};

				const role = enemy.GetAttribute("Role") as EnemyRole ?? EnemyRole.Bruiser;
				const score = calculateTargetScore(role, candidate);

				if (score > bestScore) {
					bestScore = score;
					bestTarget = char;
				}
			});

			if (bestTarget) {
				const humanoid = enemy.FindFirstChildOfClass("Humanoid");
				if (humanoid) {
					humanoid.MoveTo(bestTarget.GetPivot().Position);
				}
			}
		});
	}
}
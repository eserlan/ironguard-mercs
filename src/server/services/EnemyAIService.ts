import { Service, OnStart } from "@flamework/core";
import { TargetingBiasService } from "./TargetingBiasService";

@Service({})
export class EnemyAIService implements OnStart {
	constructor(private biasService: TargetingBiasService) {}

	onStart() {}

	public selectTarget(enemy: any, players: Player[]): Player {
		// Mock logic: prefer player with highest bias
		let bestTarget = players[0];
		let highestBias = -1;

		players.forEach((p) => {
			const bias = this.biasService.getBias(tostring(p.UserId));
			if (bias > highestBias) {
				highestBias = bias;
				bestTarget = p;
			}
		});

		return bestTarget;
	}
}

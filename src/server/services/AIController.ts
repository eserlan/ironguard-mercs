import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class AIController implements OnStart {
	private enemies = new Set<Model>();

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

		this.enemies.forEach((enemy) => {
			const target = players[0].Character; // Simple aggro
			if (!target) return;

			const humanoid = enemy.FindFirstChildOfClass("Humanoid");
			if (humanoid) {
				humanoid.MoveTo(target.GetPivot().Position);
			}
		});
	}
}
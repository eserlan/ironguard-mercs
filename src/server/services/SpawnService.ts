import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";
import { Vec3 } from "../../shared/domain/world";

@Service({})
export class SpawnService implements OnStart {
	onStart() {}

	public spawnPlayers(players: Player[], spawnPoints: Vec3[]) {
		Log.info(`Spawning ${players.size()} players at ${spawnPoints.size()} points`);
		
		players.forEach((player, index) => {
			const spawnPos = spawnPoints[index % spawnPoints.size()];
			this.spawnPlayerAt(player, spawnPos);
		});
	}

	private spawnPlayerAt(player: Player, pos: Vec3) {
		if (!player.Character) {
			player.CharacterAdded.Wait();
		}

		const root = player.Character?.FindFirstChild("HumanoidRootPart") as BasePart;
		if (root) {
			root.CFrame = new CFrame(pos.x, pos.y + 3, pos.z);
			Log.info(`Spawned ${player.Name} at ${pos.x}, ${pos.y}, ${pos.z}`);
		}
	}
}

import { Service, OnStart } from "@flamework/core";
import { MissionMode } from "../../shared/domain/run";
import { Log } from "../../shared/utils/log";

@Service({})
export class MatchmakingService implements OnStart {
	private pendingPlayers = new Map<MissionMode, Player[]>();

	onStart() {
		this.pendingPlayers.set("Standard", []);
		this.pendingPlayers.set("Ironman", []);
	}

	public addToQueue(player: Player, mode: MissionMode) {
		const queue = this.pendingPlayers.get(mode) ?? [];
		if (queue.find(p => p === player)) return;

		queue.push(player);
		this.pendingPlayers.set(mode, queue);
		Log.info(`Player ${player.Name} joined ${mode} queue. Total: ${queue.size()}`);

		if (queue.size() >= 1) { // In MVP, start with any number
			this.startMatch(mode);
		}
	}

	private startMatch(mode: MissionMode) {
		const queue = this.pendingPlayers.get(mode) ?? [];
		if (queue.size() === 0) return;

		const matchPlayers = [...queue];
		queue.clear();
		this.pendingPlayers.set(mode, queue);

		Log.info(`Starting ${mode} match for ${matchPlayers.size()} players`);
		// In real impl: Teleport to new PlaceInstance with RunConfig
	}
}

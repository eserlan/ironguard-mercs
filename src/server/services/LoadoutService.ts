import { Service, OnStart } from "@flamework/core";
import { Events } from "../events";
import { Log } from "../../shared/utils/log";
import { ClassRegistry } from "../../shared/domain/classes/config";
import { PlayerLoadout } from "../../shared/domain/classes/types";
import { validateLoadout } from "../../shared/algorithms/classes/loadout-val";

@Service({})
export class LoadoutService implements OnStart {
	private playerLoadouts = new Map<number, PlayerLoadout>();

	onStart() {
		Log.info("LoadoutService started");
		Events.SetLoadout.connect((player, slots) => {
			this.handleSetLoadout(player, slots);
		});
	}

	private handleSetLoadout(player: Player, slots: { slotIndex: number; abilityId: string }[]) {
		// Mock class selection for now or assume previous SelectClass call
		const classId = "shield-saint"; 
		const config = ClassRegistry.get(classId);
		
		if (!config) {
			Events.LoadoutRejected.fire(player, "InvalidClass");
			return;
		}

		const loadout: PlayerLoadout = { classId, equippedSlots: slots };
		const result = validateLoadout(loadout, config);

		if (result.valid) {
			this.playerLoadouts.set(player.UserId, loadout);
			Events.LoadoutConfirmed.fire(player, classId, slots);
		} else {
			Events.LoadoutRejected.fire(player, result.reason || "Unknown");
		}
	}

	public getLoadout(userId: number) {
		return this.playerLoadouts.get(userId);
	}
}

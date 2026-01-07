import { Service, OnStart } from "@flamework/core";
import { Roster, Mercenary } from "../../shared/domain/roster";
import { Log } from "../../shared/utils/log";

@Service({})
export class RosterService implements OnStart {
	private rosters = new Map<number, Roster>();

	onStart() {
		Log.info("RosterService started");
	}

	public getRoster(player: Player): Roster {
		let roster = this.rosters.get(player.UserId);
		if (!roster) {
			roster = this.createDefaultRoster(player);
			this.rosters.set(player.UserId, roster);
		}
		return roster;
	}

	public updateRoster(player: Player, roster: Roster) {
		this.rosters.set(player.UserId, roster);
		// In future: Persist to DataStore
	}

	private createDefaultRoster(player: Player): Roster {
		const merc: Mercenary = {
			id: "m-" + player.UserId + "-1",
			name: "New Recruit",
			className: "Scout",
			level: 1,
			xp: 0,
			curHealth: 100,
			equippedGear: []
		};

		return {
			playerId: tostring(player.UserId),
			capacity: 5,
			mercenaries: [merc],
			currency: new Map([["Gold", 500]])
		};
	}
}

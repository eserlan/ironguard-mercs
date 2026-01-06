import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class PerkService implements OnStart {
	onStart() {}

	public applyPerk(player: Player, perkId: string) {
		Log.info(`Applying perk ${perkId} to ${player.Name}`);
		// Real impl: apply stat mods or augments via EffectService
	}
}

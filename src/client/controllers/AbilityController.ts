import { Controller, OnStart } from "@flamework/core";
import { CooldownManager } from "../../shared/algorithms/abilities/cooldowns";
import { Log } from "../../shared/utils/log";

@Controller({})
export class AbilityController implements OnStart {
	private cdMgr = new CooldownManager();

	onStart() {
		Log.info("AbilityController started");
	}

	public tryCast(abilityId: string) {
		// Client-side prediction
		Log.info(`Attempting local cast: ${abilityId}`);
	}
}

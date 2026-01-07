import { Service, OnStart } from "@flamework/core";
import { evaluateTrigger } from "../../shared/algorithms/gear/trigger-eval";
import { Log } from "../../shared/utils/log";

@Service({})
export class GearEffectService implements OnStart {
	onStart() {
		Log.info("GearEffectService started");
		// Real impl: subscribe to CombatService streams (rx)
	}

	public onCombatEvent(player: Player, event: string) {
		// Mock: check player gear for triggers
		Log.info(`Checking gear triggers for ${player.Name} on ${event}`);
	}
}

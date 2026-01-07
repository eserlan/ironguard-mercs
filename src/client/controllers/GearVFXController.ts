import { Controller, OnStart } from "@flamework/core";
import { GlobalEvents } from "../../shared/net";
import { Log } from "../../shared/utils/log";

@Controller({})
export class GearVFXController implements OnStart {
	onStart() {
		GlobalEvents.client.GearEffectTriggered.connect((gearId, effectType) => {
			this.playEffect(gearId, effectType);
		});
	}

	private playEffect(gearId: string, effectType: string) {
		Log.info(`Playing visual for ${gearId} (${effectType})`);
	}
}

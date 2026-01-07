import { Controller, OnStart } from "@flamework/core";
import { Events } from "../events";

@Controller({})
export class GearVFXController implements OnStart {
	onStart() {
		Events.GearEffectTriggered.connect((gearId: string, effectType: string) => {
			print(`VFX: Gear ${gearId} triggered ${effectType}`);
		});
	}
}

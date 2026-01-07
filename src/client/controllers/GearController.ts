import { Controller, OnStart } from "@flamework/core";
import { GlobalEvents } from "../../shared/net";
import { Log } from "../../shared/utils/log";

@Controller({})
export class GearController implements OnStart {
	onStart() {
		Log.info("GearController started");
	}

	public requestEquip(slot: string, gearId: string) {
		GlobalEvents.client.EquipItem.fire(slot, gearId);
	}
}

import { Controller, OnStart } from "@flamework/core";
import { Events } from "../events";

@Controller({})
export class GearController implements OnStart {
	onStart() {}

	public equipGear(slot: string, gearId: string) {
		Events.EquipItem.fire(slot, gearId);
	}
}

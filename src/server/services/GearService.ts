import { Service, OnStart } from "@flamework/core";
import { GlobalEvents } from "../../shared/net";
import { EquipmentSlot, PlayerEquipment } from "../../shared/domain/gear/types";
import { Log } from "../../shared/utils/log";

@Service({})
export class GearService implements OnStart {
	private playerEquipment = new Map<number, PlayerEquipment>();

	onStart() {
		Log.info("GearService started");
		GlobalEvents.server.EquipItem.connect((player, slot, gearId) => {
			this.handleEquip(player, slot as EquipmentSlot, gearId);
		});
	}

	private handleEquip(player: Player, slot: EquipmentSlot, gearId: string) {
		// Real impl: const isSafe = this.runService.isSafeRoom();
		const isSafe = true; // Mock for MVP
		if (!isSafe) {
			Log.warn(`Player ${player.Name} tried to equip gear outside Safe Room`);
			return;
		}
		Log.info(`Player ${player.Name} equipping ${gearId} to ${slot}`);
	}

	public getEquipment(userId: number) {
		return this.playerEquipment.get(userId);
	}

	public syncCooldown(player: Player, slot: EquipmentSlot, remaining: number) {
		// Real impl: broadcast SlotCooldownState from 005 logic
	}

	public replenishConsumables(player: Player) {
		Log.info(`Replenishing consumables for ${player.Name}`);
	}
}

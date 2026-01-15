import { Service, OnStart } from "@flamework/core";
import { HttpService } from "@rbxts/services";
import { Events } from "../events";
import { Log } from "../../shared/utils/log";

@Service({})
export class GearService implements OnStart {
	private playerEquipment = new Map<number, any>();

	onStart() {
		Log.info("GearService started");
		Events.EquipItem.connect((player, slot, gearId) => {
			this.equipItem(player, slot, gearId);
		});
	}

	private equipItem(player: Player, slot: any, gearId: string) {
		// Real impl: const isSafe = this.runService.isSafeRoom();
		const isSafe = true; // Mock for MVP
		if (!isSafe) {
			Log.warn(`Player ${player.Name} tried to equip gear outside Safe Room`);
			return;
		}
		Log.info(`Player ${player.Name} equipping ${gearId} to ${slot} `);
	}

	public getEquipment(userId: number) {
		return this.playerEquipment.get(userId);
	}

	public applyLoadoutToPlayer(player: Player, loadout: Record<string, string>) {
		this.playerEquipment.set(player.UserId, loadout);
		Log.info(`Applied loadout to ${player.Name}: ${HttpService.JSONEncode(loadout)}`);
		// In real impl: register stat modifiers and effects with EffectService
	}

	public syncCooldown(player: Player, slot: any, remaining: number) {
		// Real impl: broadcast SlotCooldownState from 005 logic
	}

	public replenishConsumables(player: Player) {
		Log.info(`Replenishing consumables for ${player.Name}`);
	}
}

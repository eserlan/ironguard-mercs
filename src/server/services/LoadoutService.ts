import { Service, OnStart } from "@flamework/core";
import { Events } from "../events";
import { Log } from "../../shared/utils/log";
import { ClassRegistry } from "../../shared/domain/classes/config";
import { PlayerLoadout } from "../../shared/domain/classes/types";
import { validateLoadout } from "../../shared/algorithms/classes/loadout-val";
import { PlayerDataService } from "./PlayerDataService";

@Service({})
export class LoadoutService implements OnStart {
	constructor(private readonly playerDataService: PlayerDataService) { }

	private playerLoadouts = new Map<number, PlayerLoadout>();

	onStart() {
		Log.info("LoadoutService started");

		Events.SetLoadout.connect((player, slots) => {
			this.handleSetLoadout(player, slots);
		});

		Events.SelectClass.connect((player, classId) => {
			this.handleSelectClass(player, classId);
		});

		// Auto-restore when profile is loaded
		this.playerDataService.onProfileLoaded.Event.Connect((player, profile) => {
			const classId = profile.Global.LastSelectedClassId;
			const classRecord = profile.Classes[classId];
			const equippedSlots: { slotIndex: number; abilityId: string }[] = [];

			// Map stored loadout strings back to slot objects if possible
			// The current simple format in ClassRecord is `Loadout: string[]`.
			// We need to map string[] -> formatted slots for the client.
			// Assuming array index = slot index.
			if (classRecord && classRecord.Loadout) {
				classRecord.Loadout.forEach((abilityId: string, index: number) => {
					equippedSlots.push({ slotIndex: index, abilityId: abilityId });
				});
			}

			// Set runtime state
			this.setSessionLoadout(player.UserId, classId, equippedSlots);

			// Notify client (so they see the correct class/gear active)
			// Wait a frame to ensure client is ready if they just joined? 
			// Actually Client requests data usually, but pushing 'LoadoutConfirmed' works as a "Set State"
			Events.LoadoutConfirmed.fire(player, classId, equippedSlots);
		});
	}

	private handleSelectClass(player: Player, classId: string) {
		const config = ClassRegistry.get(classId);
		if (!config) return;

		// Persist selection
		this.playerDataService.setSelectedClass(player, classId);

		// Switch runtime loadout to the new class's stored loadout (persistence has priority)
		const profile = this.playerDataService.getProfile(player);
		const classRecord = profile?.Classes[classId];
		const storedLoadout = classRecord?.Loadout ?? [];

		const equippedSlots = storedLoadout.map((aid, idx) => ({ slotIndex: idx, abilityId: aid }));

		this.setSessionLoadout(player.UserId, classId, equippedSlots);
		Events.LoadoutConfirmed.fire(player, classId, equippedSlots);
	}

	private handleSetLoadout(player: Player, slots: { slotIndex: number; abilityId: string }[]) {
		// Use current session class, or fallback to default
		const currentLoadout = this.playerLoadouts.get(player.UserId);
		const classId = currentLoadout?.classId ?? "shield-saint";
		const config = ClassRegistry.get(classId);

		if (!config) {
			Events.LoadoutRejected.fire(player, "InvalidClass");
			return;
		}

		const loadout: PlayerLoadout = { classId, equippedSlots: slots };
		const result = validateLoadout(loadout, config);

		if (result.valid) {
			this.playerLoadouts.set(player.UserId, loadout);

			// Persist the new loadout string array
			const loadoutStrings = new Array<string>(slots.size());
			// We need to store based on slot index logic. 
			// Simple array mapping: index = slotIndex.
			slots.forEach(s => loadoutStrings[s.slotIndex] = s.abilityId);

			this.playerDataService.setClassLoadout(player, classId, loadoutStrings);

			Events.LoadoutConfirmed.fire(player, classId, slots);
		} else {
			Events.LoadoutRejected.fire(player, result.reason || "Unknown");
		}
	}

	public getLoadout(userId: number) {
		return this.playerLoadouts.get(userId);
	}

	public setSessionLoadout(userId: number, classId: string, equippedSlots: { slotIndex: number; abilityId: string }[]) {
		this.playerLoadouts.set(userId, { classId, equippedSlots });
	}
}

import { Service, OnStart } from "@flamework/core";
import { Components } from "@flamework/components";
import { ClassRegistry } from "../../shared/domain/classes/config";
import { SHIELD_SAINT, ASHBLADE, VANGUARD } from "../../shared/data/classes/starter";
import { Log } from "../../shared/utils/log";
import { HealthComponent } from "../cmpts/HealthComponent";
import { LoadoutService } from "./LoadoutService";

@Service({})
export class ClassService implements OnStart {
	constructor(
		private components: Components,
		private loadoutService: LoadoutService,
	) { }

	onStart() {
		Log.info("ClassService started");
		ClassRegistry.register(SHIELD_SAINT);
		ClassRegistry.register(ASHBLADE);
		ClassRegistry.register(VANGUARD);
	}

	public applyClassToPlayer(player: Player, classId: string) {
		const config = ClassRegistry.get(classId);
		if (!config) return;

		const character = player.Character;
		if (character) {
			const health = this.components.getComponent<HealthComponent>(character);
			if (health && config.baseStats.hp) {
				health.setMaxHealth(config.baseStats.hp);
				health.setHealth(config.baseStats.hp);
			}
		}
		// Apply first 4 abilities as default loadout
		const abilityIds = (config.abilityLibrary as string[]).filter((_, index) => index < 4);
		const slots = abilityIds.map((id, index) => ({
			slotIndex: index,
			abilityId: id,
		}));
		this.loadoutService.setSessionLoadout(player.UserId, classId, slots);
	}



	public getClass(id: string) {
		return ClassRegistry.get(id);
	}

	public isClassUnlocked(_userId: number, classId: string): boolean {
		// Real impl: check PlayerProfile
		// For now: Vanguard is locked
		return classId !== "vanguard";
	}
}

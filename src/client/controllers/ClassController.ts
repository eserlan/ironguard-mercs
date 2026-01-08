import { Controller, OnStart } from "@flamework/core";
import { ClassRegistry } from "shared/domain/classes/config";
import { AbilityRegistry } from "shared/domain/abilities/config";
import { SHIELD_SAINT, ASHBLADE, VANGUARD } from "shared/data/classes/starter";
import { DASH, FIREBALL, SHIELD } from "shared/data/abilities/starter";
import { SHIELD_WALL, RESCUE_LEAP } from "shared/data/abilities/shield-saint";
import { LUNGE, EXECUTE } from "shared/data/abilities/ashblade";
import { Log } from "shared/utils/log";

/**
 * Client-side controller that registers class definitions.
 * Classes are registered in shared config so components can access them.
 */
@Controller({})
export class ClassController implements OnStart {
	onStart() {
		Log.info("[ClassController] Registering starter classes and abilities");

		// Register all starter classes (same as server)
		ClassRegistry.register(SHIELD_SAINT);
		ClassRegistry.register(ASHBLADE);
		ClassRegistry.register(VANGUARD);

		// Register abilities
		AbilityRegistry.register(DASH);
		AbilityRegistry.register(FIREBALL);
		AbilityRegistry.register(SHIELD);
		AbilityRegistry.register(SHIELD_WALL);
		AbilityRegistry.register(RESCUE_LEAP);
		AbilityRegistry.register(LUNGE);
		AbilityRegistry.register(EXECUTE);

		Log.info(`[ClassController] Registered ${ClassRegistry.getAll().size()} classes and ${AbilityRegistry.getAll().size()} abilities`);
	}
}


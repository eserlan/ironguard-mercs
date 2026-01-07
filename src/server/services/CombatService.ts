import { Service } from "@flamework/core";
import { validateIntent } from "../../shared/algorithms/combat/validation";
import { resolveDamage } from "../../shared/algorithms/combat/damage";
import { CombatRNG } from "../../shared/algorithms/combat/rng";
import { Weapons } from "../../shared/domain/combat/config";
import { HealthComponent } from "../cmpts/HealthComponent";
import { Components } from "@flamework/components";
import { Log } from "../../shared/utils/log";

@Service({})
export class CombatService {
	private rng = new CombatRNG(os.time());
	private cooldowns = new Map<number, Map<string, number>>(); // UserId -> (AbilityId -> LastUsed)

	public processIntent(player: Player, intent: any) {
		const now = os.clock();
		const playerCooldowns = this.cooldowns.get(player.UserId) ?? new Map<string, number>();
		
		const lastUsed = playerCooldowns.get(intent.abilityId) ?? 0;
		if (now - lastUsed < (intent.cooldown ?? 1)) {
			Log.warn(`Ability ${intent.abilityId} on cooldown for ${player.Name}`);
			return;
		}

		playerCooldowns.set(intent.abilityId, now);
		this.cooldowns.set(player.UserId, playerCooldowns);

		if (!validateIntent(intent, now)) {
			Log.warn(`Invalid intent from ${player.Name}`);
			return;
		}

		const weapon = Weapons[intent.weaponId];
		if (!weapon) return;

		// Real impl: use HitDetectionService to find target
		const target: Instance | undefined = undefined; 
		if (!target) return;

		const health = Components.getComponent<HealthComponent>(target);
		if (!health) return;

		const result = resolveDamage(
			tostring(player.UserId),
			tostring(target.Name),
			weapon,
			0, // TODO: Get target armor
			this.rng,
			100, // TODO: Get target current HP
		);

		if (result.amount > 0) {
			health.takeDamage(result.amount);
			// Emit GlobalEvents.server.CombatEvent...
		}
	}
}

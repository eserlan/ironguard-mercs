import { Service, OnStart } from "@flamework/core";
import { Components } from "@flamework/components";
import { GlobalEvents } from "../../shared/net";
import { CombatRNG } from "../../shared/algorithms/combat/rng";
import { resolveDamage } from "../../shared/algorithms/combat/damage";
import { Weapons } from "../../shared/domain/combat/config";
import { HealthComponent } from "../cmpts/HealthComponent";
import { Log } from "../../shared/utils/log";
import { CombatValidation } from "./CombatValidation";
import { HitDetectionService } from "./HitDetectionService";
import { CombatEvent } from "../../shared/domain/combat/types";

@Service({})
export class CombatService implements OnStart {
	private rng: CombatRNG | undefined;
	private cooldowns = new Map<number, Map<string, number>>();

	constructor(
		private validator: CombatValidation,
		private hitDetection: HitDetectionService,
		private components: Components
	) { }

	onStart() {
		Log.info("CombatService initialized");

		GlobalEvents.server.CombatIntent.connect((player, intent) => {
			this.processIntent(player, intent);
		});
	}

	public setMasterSeed(seed: number) {
		this.rng = new CombatRNG(seed);
	}

	public processIntent(player: Player, intent: any) {
		if (!this.rng) return;

		const character = player.Character;
		if (!character) return;

		const now = os.clock();
		if (!this.validator.validateTimestamp(intent.timestamp, now)) return;

		const weapon = Weapons[intent.weaponId];
		if (!weapon) return;

		// Cooldown check
		const playerCooldowns = this.cooldowns.get(player.UserId) ?? new Map<string, number>();
		const lastUsed = playerCooldowns.get(intent.weaponId) ?? 0;
		if (now - lastUsed < weapon.cooldown) return;

		// Hit Detection
		let targetInstance: Instance | undefined;
		if (weapon.type === "Hitscan") {
			const hit = this.hitDetection.raycast(
				new Vector3(intent.origin.x, intent.origin.y, intent.origin.z),
				new Vector3(intent.direction.x, intent.direction.y, intent.direction.z),
				weapon.range,
				[character],
			);
			targetInstance = hit?.Instance;
		}

		if (!targetInstance) return;

		// Resolution
		const health = this.components.getComponent<HealthComponent>(targetInstance)
			?? (targetInstance.Parent ? this.components.getComponent<HealthComponent>(targetInstance.Parent) : undefined);

		if (!health) return;

		// Update cooldown
		playerCooldowns.set(intent.weaponId, now);
		this.cooldowns.set(player.UserId, playerCooldowns);

		const result = resolveDamage(
			tostring(player.UserId),
			tostring(targetInstance.Name),
			weapon,
			{
				baseDamage: 0, // In real app, look up from player stats
				synergyMultiplier: 0.2, // Placeholder
				critChance: 0.1,
				critMultiplier: 2.0,
			},
			false, // isSynergyActive placeholder
			0, // Armor placeholder
			this.rng,
			targetInstance.GetAttribute("Health") as number ?? 100
		);

		if (result.amount > 0) {
			health.takeDamage(result.amount);
			GlobalEvents.server.CombatOccurred.broadcast({
				attackerId: tostring(player.UserId),
				targetId: result.targetId ?? "unknown",
				weaponId: intent.weaponId,
				damage: result.amount,
				isCrit: result.isCrit,
				isFatal: result.isFatal,
				timestamp: os.time(),
			});
		}
	}
}
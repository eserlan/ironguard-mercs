import { Service, OnStart } from "@flamework/core";
import { Components } from "@flamework/components";
import { Events } from "../events";
import { CombatRNG } from "../../shared/algorithms/combat/rng";
import { resolveDamage } from "../../shared/algorithms/combat/damage";
import { Weapons } from "../../shared/domain/combat/config";
import { HealthComponent } from "../cmpts/HealthComponent";
import { Log } from "../../shared/utils/log";
import { CombatValidation } from "./CombatValidation";
import { HitDetectionService } from "./HitDetectionService";
import { CombatIntent } from "../../shared/domain/combat/types";

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
		Log.info("CombatService started");
		Events.CombatIntent.connect((player: Player, intent: CombatIntent) => {
			this.processIntent(player, intent);
		});
	}

	public getRng(): CombatRNG | undefined {
		return this.rng;
	}

	public setMasterSeed(seed: number) {
		this.rng = new CombatRNG(seed);
	}

	public processIntent(player: Player, intent: CombatIntent) {
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
			this.broadcastCombatEvent(player.UserId, result.targetId ?? "unknown", intent.weaponId, result.amount, result.isCrit, result.isFatal);
		}
	}

	public applyDamage(target: Instance, amount: number, isCrit: boolean, isFatal: boolean, attackerId: string, weaponId: string) {
		const health = this.components.getComponent<HealthComponent>(target)
			?? (target.Parent ? this.components.getComponent<HealthComponent>(target.Parent) : undefined);

		if (!health) return;

		health.takeDamage(amount);
		this.broadcastCombatEvent(tonumber(attackerId) ?? 0, target.Name, weaponId, amount, isCrit, isFatal);
	}

	private broadcastCombatEvent(attackerId: number, targetId: string, weaponId: string, damage: number, isCrit: boolean, isFatal: boolean) {
		Events.CombatOccurred.broadcast({
			attackerId: tostring(attackerId),
			targetId: targetId,
			weaponId: weaponId,
			damage: damage,
			isCrit: isCrit,
			isFatal: isFatal,
			timestamp: os.time(),
		});
	}
}
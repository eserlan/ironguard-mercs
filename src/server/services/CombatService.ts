import { Service, OnStart } from "@flamework/core";
import { Components } from "@flamework/components";
import { Events } from "../events";
import { CombatRNG } from "../../shared/algorithms/combat/rng";
import { resolveDamage } from "../../shared/algorithms/combat/damage";
import { isPointInMeleeArc } from "../../shared/algorithms/combat/geometry";
import { Weapons, MeleeProfile, WeaponConfig } from "../../shared/domain/combat/config";
import { HealthComponent } from "../cmpts/HealthComponent";
import { Log } from "../../shared/utils/log";
import { CombatValidation } from "./CombatValidation";
import { HitDetectionService } from "./HitDetectionService";
import { CombatIntent } from "../../shared/domain/combat/types";
import { getTime, getClock } from "shared/utils/time";

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
		Log.info(`Processing ${intent.weaponId} intent from ${player.Name}`);

		if (!this.rng) {
			Log.warn(`RNG not initialized in CombatService, using default for ${player.Name}`);
			this.rng = new CombatRNG(1);
		}

		const character = player.Character;
		if (!character) return;

		const now = getClock();
		if (!this.validator.validateTimestamp(intent.timestamp, now)) return;

		const weapon = Weapons[intent.weaponId];
		if (!weapon) return;

		// Cooldown check
		const playerCooldowns = this.cooldowns.get(player.UserId) ?? new Map<string, number>();
		const lastUsed = playerCooldowns.get(intent.weaponId) ?? 0;
		if (now - lastUsed < weapon.cooldown) return;

		// Hit Detection
		if (weapon.type === "Hitscan") {
			const hit = this.hitDetection.raycast(
				new Vector3(intent.origin.x, intent.origin.y, intent.origin.z),
				new Vector3(intent.direction.x, intent.direction.y, intent.direction.z),
				weapon.range,
				[character],
			);

			// Broadcast activation for vfx
			Events.AbilityActivated.broadcast(tostring(player.UserId), intent.weaponId, -1);

			if (hit?.Instance) {
				this.resolveHit(player, weapon, hit.Instance);
			} else {
				Log.info(`${player.Name} ${intent.weaponId} missed (no target hit)`);
			}
		} else if (weapon.type === "Melee") {
			// Broadcast activation immediately for vfx (swing start)
			Events.AbilityActivated.broadcast(tostring(player.UserId), intent.weaponId, -1);

			if (weapon.meleeProfile) {
				// Advanced melee with hit window/arc
				const delay = weapon.meleeProfile.hitWindow[0];
				task.delay(delay, () => {
					this.resolveMeleeArc(player, character, weapon.meleeProfile!, new Vector3(intent.direction.x, intent.direction.y, intent.direction.z));
				});
			} else {
				// Basic fallback melee
				const hit = this.hitDetection.raycast(
					new Vector3(intent.origin.x, intent.origin.y, intent.origin.z),
					new Vector3(intent.direction.x, intent.direction.y, intent.direction.z),
					weapon.range,
					[character],
				);
				if (hit?.Instance) {
					this.resolveHit(player, weapon, hit.Instance);
				}
			}
		} else if (weapon.type === "Shield") {
			if (intent.action === "Begin") {
				character.SetAttribute("IsBlocking", true);
				Log.info(`${player.Name} is now blocking`);
			} else {
				character.SetAttribute("IsBlocking", false);
				Log.info(`${player.Name} stopped blocking`);
			}
			return;
		}
	}

	private resolveMeleeArc(player: Player, character: Model, profile: MeleeProfile, direction: Vector3) {
		const origin = character.GetPivot().Position;
		const lookDir = direction.Unit;
		const range = profile.range;

		const parts = this.hitDetection.overlapSphere(origin, range, [character]);
		const seenModels = new Set<Model>();

		for (const part of parts) {
			const model = part.FindFirstAncestorOfClass("Model");
			if (model && !seenModels.has(model)) {
				const targetPos = model.GetPivot().Position;

				// Use shared geometry logic (X,Y,Z structure matches Vector3)
				if (isPointInMeleeArc(
					{ X: origin.X, Y: origin.Y, Z: origin.Z }, // Explicit cast just to be safe/clear
					{ X: lookDir.X, Y: lookDir.Y, Z: lookDir.Z },
					{ X: targetPos.X, Y: targetPos.Y, Z: targetPos.Z },
					range,
					profile.arcDegrees
				)) {
					seenModels.add(model);
					const weaponStub: WeaponConfig = { ...Weapons.BasicHit, damage: Weapons.BasicHit.damage * profile.damage };
					this.resolveHit(player, weaponStub, model);
				}
			}
		}
	}

	private resolveHit(player: Player, weapon: WeaponConfig, targetInstance: Instance) {
		// Resolution logic moved to helper
		// Fix: Use ancestor Model lookup to handle accessories/limbs
		const model = targetInstance.FindFirstAncestorOfClass("Model") ?? (targetInstance.IsA("Model") ? targetInstance : undefined);
		const health = model ? this.components.getComponent<HealthComponent>(model) : undefined;

		if (!health) return;

		const isTargetBlocking = targetInstance.GetAttribute("IsBlocking") === true ||
			(targetInstance.Parent?.GetAttribute("IsBlocking") === true);

		const result = resolveDamage(
			tostring(player.UserId),
			tostring(targetInstance.Name),
			weapon,
			{
				baseDamage: 0,
				synergyMultiplier: 0.2,
				critChance: 0.1,
				critMultiplier: 2.0,
			},
			false,
			0,
			this.rng!,
			targetInstance.GetAttribute("Health") as number ?? 100,
			isTargetBlocking
		);

		if (result.amount > 0) {
			health.takeDamage(result.amount);
		}

		const targetPos = model?.GetPivot().Position;
		this.broadcastCombatEvent(player.UserId, result.targetId ?? "unknown", weapon.id, result.amount, result.isCrit, result.isFatal, targetPos);
	}

	public applyDamage(target: Instance, amount: number, isCrit: boolean, isFatal: boolean, attackerId: string, weaponId: string) {
		const health = this.components.getComponent<HealthComponent>(target)
			?? (target.Parent ? this.components.getComponent<HealthComponent>(target.Parent) : undefined);

		if (!health) return;

		health.takeDamage(amount);

		const targetPos = (target.IsA("Model") ? target.GetPivot().Position : (target.IsA("BasePart") ? target.Position : undefined));
		this.broadcastCombatEvent(tonumber(attackerId) ?? 0, target.Name, weaponId, amount, isCrit, isFatal, targetPos);
	}

	private broadcastCombatEvent(attackerId: number, targetId: string, weaponId: string, damage: number, isCrit: boolean, isFatal: boolean, position?: Vector3) {
		Log.info(`[Combat] Broadcasting: ${damage} damage to ${targetId} @ ${position}`);
		Events.CombatOccurred.broadcast({
			attackerId: tostring(attackerId),
			targetId: targetId,
			weaponId: weaponId,
			damage: damage,
			isCrit: isCrit,
			isFatal: isFatal,
			timestamp: getTime(),
			position: position ? { x: position.X, y: position.Y, z: position.Z } : undefined,
		});
	}
}
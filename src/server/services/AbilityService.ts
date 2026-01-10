import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { AbilityRegistry } from "../../shared/domain/abilities/config";
import { SlotCooldownManager } from "../../shared/algorithms/classes/slot-cooldowns";
import { EffectService } from "./EffectService";
import { LoadoutService } from "./LoadoutService";
import { AbilityIntent } from "../../shared/domain/abilities/types";
import { Log } from "../../shared/utils/log";
import { Events } from "../events";
import { DASH, FIREBALL, SHIELD } from "../../shared/data/abilities/starter";
import { OATH_SHIELD, VOW_LASH, SANCTUARY_STEP, AEGIS_PULSE, JUDGEMENT_LINE, MARTYRS_PROMISE } from "../../shared/data/abilities/shield-saint";
import { KINDLE_EDGE, CINDER_STEP, ASH_MARK, FLARE_PARRY, EMBER_CHAIN, BLAZE_FINISHER } from "../../shared/data/abilities/ashblade";
import { getClock } from "shared/utils/time";

// Default Shield Saint loadout for testing
const DEFAULT_SHIELD_SAINT_LOADOUT = [
	{ slotIndex: 0, abilityId: "oath-shield" },
	{ slotIndex: 1, abilityId: "vow-lash" },
	{ slotIndex: 2, abilityId: "sanctuary-step" },
	{ slotIndex: 3, abilityId: "aegis-pulse" },
];

@Service({})
export class AbilityService implements OnStart {
	private cdMgr = new SlotCooldownManager();

	constructor(
		private effectService: EffectService,
		private loadoutService: LoadoutService,
	) { }

	onStart() {
		Log.info("AbilityService (Player Classes) started");

		// Register all abilities
		AbilityRegistry.register(DASH);
		AbilityRegistry.register(FIREBALL);
		AbilityRegistry.register(SHIELD);
		AbilityRegistry.register(OATH_SHIELD);
		AbilityRegistry.register(VOW_LASH);
		AbilityRegistry.register(SANCTUARY_STEP);
		AbilityRegistry.register(AEGIS_PULSE);
		AbilityRegistry.register(JUDGEMENT_LINE);
		AbilityRegistry.register(MARTYRS_PROMISE);
		AbilityRegistry.register(KINDLE_EDGE);
		AbilityRegistry.register(CINDER_STEP);
		AbilityRegistry.register(ASH_MARK);
		AbilityRegistry.register(FLARE_PARRY);
		AbilityRegistry.register(EMBER_CHAIN);
		AbilityRegistry.register(BLAZE_FINISHER);

		// Listen for ability intents from clients
		Events.AbilityIntent.connect((player, intent) => {
			this.handleIntent(player, intent);
		});

		// Assign default loadout to players on join for testing
		// TODO: Remove or gate behind dev flag before production
		Players.PlayerAdded.Connect((player) => {
			this.assignDefaultLoadout(player);
		});

		// Handle players already in game (for Studio testing)
		for (const player of Players.GetPlayers()) {
			this.assignDefaultLoadout(player);
		}
	}

	/**
	 * Assigns a default Shield Saint loadout to a player
	 * NOTE: This is a testing convenience and bypasses the mercenary selection flow.
	 * Should be removed or gated behind a development flag before production deployment.
	 */
	private assignDefaultLoadout(player: Player) {
		const classId = "shield-saint";
		this.loadoutService.setSessionLoadout(player.UserId, classId, DEFAULT_SHIELD_SAINT_LOADOUT);
		Events.LoadoutConfirmed.fire(player, classId, DEFAULT_SHIELD_SAINT_LOADOUT);
		Log.info(`Assigned default Shield Saint loadout to ${player.Name}`);
	}

	public handleIntent(player: Player, intent: AbilityIntent) {
		const loadout = this.loadoutService.getLoadout(player.UserId);
		if (!loadout) {
			Log.info(`No loadout found for ${player.Name}`);
			return;
		}

		const slot = loadout.equippedSlots.find((s) => s.slotIndex === intent.slotIndex);
		if (!slot) {
			Log.info(`No ability in slot ${intent.slotIndex} for ${player.Name}`);
			return;
		}

		const config = AbilityRegistry.get(slot.abilityId);
		if (!config) {
			Log.info(`Ability config not found: ${slot.abilityId}`);
			return;
		}

		const variant = intent.action === "Top" ? config.variants.top : config.variants.bottom;
		const now = getClock();

		if (!this.cdMgr.canCast(tostring(player.UserId), intent.slotIndex, now)) {
			Log.info(`Slot ${intent.slotIndex} on cooldown for ${player.Name}`);
			return;
		}

		this.cdMgr.setCooldown(tostring(player.UserId), intent.slotIndex, now, variant.cooldown);
		Events.SlotCooldownState.fire(player, intent.slotIndex, variant.cooldown, variant.cooldown);
		Events.AbilityActivated.broadcast(tostring(player.UserId), slot.abilityId, intent.slotIndex);

		Log.info(`${player.Name} activated ${config.name} (${variant.name ?? intent.action}) on slot ${intent.slotIndex}`);

		// Execute effects
		const character = player.Character;
		const targetInstance = character; // For self-cast or placeholder

		if (!targetInstance) {
			Log.info(`No character found for ${player.Name}`);
			return;
		}

		variant.effectBlocks.forEach((block) => {
			Log.info(`Executing effect ${block.type} for ${player.Name}`);
			this.effectService.resolveEffect(targetInstance, block, tostring(player.UserId));
		});
	}
}
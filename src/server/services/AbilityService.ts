import { Service, OnStart } from "@flamework/core";
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

@Service({})
export class AbilityService implements OnStart {
	private cdMgr = new SlotCooldownManager();

	constructor(
		private effectService: EffectService,
		private loadoutService: LoadoutService,
	) { }

	onStart() {
		Log.info("AbilityService (Player Classes) started");

		// Register all abilities (mirroring ClassController)
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
	}

	public handleIntent(player: Player, intent: AbilityIntent) {
		const loadout = this.loadoutService.getLoadout(player.UserId);
		if (!loadout) return;

		const slot = loadout.equippedSlots.find((s) => s.slotIndex === intent.slotIndex);
		if (!slot) return;

		const config = AbilityRegistry.get(slot.abilityId);
		if (!config) return;

		const variant = intent.action === "Top" ? config.variants.top : config.variants.bottom;
		const now = getClock();

		if (!this.cdMgr.canCast(tostring(player.UserId), intent.slotIndex, now)) {
			return;
		}

		this.cdMgr.setCooldown(tostring(player.UserId), intent.slotIndex, now, variant.cooldown);
		Events.AbilityActivated.broadcast(tostring(player.UserId), slot.abilityId, intent.slotIndex);

		// Execute effects
		const character = player.Character;
		const targetInstance = character; // For self-cast or placeholder. Real impl would parse intent.payload to find target

		if (!targetInstance) return;

		variant.effectBlocks.forEach((block) => {
			Log.info(`Executing effect ${block.type} for ${player.Name} on ${targetInstance.Name}`);
			this.effectService.resolveEffect(targetInstance, block, tostring(player.UserId));
		});
	}
}
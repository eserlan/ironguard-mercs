import { Service } from "@flamework/core";
import { EffectBlock } from "../../shared/domain/abilities/types";

@Service({})
export class EffectService {
	public resolveEffect(_target: Instance, _block: EffectBlock) {
		// Real impl: 
		// if block.type === "Damage" -> CombatService.dealDamage
		// if block.type === "Heal" -> HealthComponent.heal
	}
}

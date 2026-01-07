import { Controller } from "@flamework/core";

@Controller({})
export class VFXController {
	public playCast(_caster: Instance, _abilityId: string) {
		// Real impl: Play animation, spawn local particles
	}
}

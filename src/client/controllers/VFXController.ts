import { Controller } from "@flamework/core";

@Controller({})
export class VFXController {
	public playCast(caster: Instance, abilityId: string) {
		// Real impl: Play animation, spawn local particles
	}
}

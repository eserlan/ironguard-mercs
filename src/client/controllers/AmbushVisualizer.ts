import { Controller, OnStart } from "@flamework/core";

@Controller({})
export class AmbushVisualizer implements OnStart {
	onStart() {
		print("AmbushVisualizer started");
	}

	public PlayAmbushVFX(position: Vector3) {
		// Placeholder for actual VFX logic
		print("Playing Ambush VFX at", position);
	}
}

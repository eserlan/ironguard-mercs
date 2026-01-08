import { Dependency } from "@flamework/core";
import { VFXController } from "client/controllers/VFXController";
import { Workspace } from "@rbxts/services";

task.wait(5);

print("--- Starting VFX Verification ---");
const vfxController = Dependency<VFXController>();

task.spawn(() => {
	while (true) {
		const pos = new Vector3(math.random(-10, 10), 10, math.random(-10, 10));
		const amount = math.random(10, 1000);
		const isCrit = math.random() > 0.8;
		
		vfxController.spawnDamageNumber(pos, amount, isCrit);
		task.wait(0.5);
	}
});

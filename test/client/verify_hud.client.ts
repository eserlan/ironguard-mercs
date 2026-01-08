import { Dependency } from "@flamework/core";
import { HudController } from "client/controllers/HudController";

task.wait(5); // Wait for Flamework to start

print("--- Starting HUD Verification ---");
const hudController = Dependency<HudController>();

task.spawn(() => {
	while (true) {
		const health = math.random(10, 100);
		hudController.updateHealth(health);
		task.wait(2);
	}
});

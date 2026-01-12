import { Controller, OnStart, OnInit } from "@flamework/core";

@Controller()
export class PlayerDataController implements OnStart, OnInit {
	onInit() {
		// Initialization logic
	}

	onStart() {
		// Placeholder for networking
		// In a real implementation, we would inject a Networking service here
		// this.networking.events.profileUpdated.connect((profile) => { ... })
		print("[PlayerDataController] Ready to receive profile updates");
	}
}

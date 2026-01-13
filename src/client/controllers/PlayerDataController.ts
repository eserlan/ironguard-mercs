import { Controller, OnStart, OnInit } from "@flamework/core";
import { PlayerProfile } from "shared/data/profiles";
import { Events } from "client/events";

@Controller()
export class PlayerDataController implements OnStart, OnInit {
	private profile?: PlayerProfile;
	public readonly onProfileUpdate = new Instance("BindableEvent");

	onInit() {
		// Initialization logic
	}

	onStart() {
		Events.ProfileUpdated.connect((profile) => this.handleProfileUpdate(profile));
		print("[PlayerDataController] Ready to receive profile updates");
	}

	private handleProfileUpdate(profile: PlayerProfile) {
		this.profile = profile;
		print(`[PlayerDataController] Received profile update. Level: ${this.getClassLevel(profile)}`);
		this.onProfileUpdate.Fire(profile);
	}

	public getProfile(): PlayerProfile | undefined {
		return this.profile;
	}

	private getClassLevel(profile: PlayerProfile): number {
		const classId = profile.Global.LastSelectedClassId;
		return profile.Classes[classId]?.Level ?? 0;
	}
}

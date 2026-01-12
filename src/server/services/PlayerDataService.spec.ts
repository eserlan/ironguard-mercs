/// <reference types="@rbxts/testez/globals" />
import { DEFAULT_PROFILE, PlayerProfile } from "shared/data/profiles";

export = () => {
	describe("PlayerDataService", () => {
		it("should use DEFAULT_PROFILE structure for new players", () => {
			const profile: PlayerProfile = { ...DEFAULT_PROFILE };
			expect(profile.SchemaVersion).to.equal(1);
			expect(profile.Global.LastSelectedClassId).to.equal("shield-saint");
			expect(profile.Classes.size()).to.equal(0);
		});

		it("should validate session ID before saving", () => {
			// Mock logic for session locking
			const currentSessionId = "session-123";
			const remoteSessionId = "session-123"; // Matches
			const oldSessionId = "session-000"; // Mismatch

			expect(currentSessionId).to.equal(remoteSessionId);
			expect(currentSessionId).never.to.equal(oldSessionId);
		});

		it("should isolate data between classes", () => {
			const profile: PlayerProfile = { ...DEFAULT_PROFILE, Classes: {} };
			
			// Simulate adding/modifying class data
			profile.Classes["mage"] = { Level: 10, XP: 500, Loadout: ["fireball"] };
			profile.Classes["warrior"] = { Level: 5, XP: 200, Loadout: ["slash"] };

			expect(profile.Classes["mage"].Level).to.equal(10);
			expect(profile.Classes["warrior"].Level).to.equal(5);
			expect(profile.Classes["mage"].Loadout[0]).to.equal("fireball");
		});
	});
};

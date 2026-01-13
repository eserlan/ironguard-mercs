import { Service, OnStart, OnInit } from "@flamework/core";
import { DataStoreService, Players, HttpService } from "@rbxts/services";
import { PlayerProfile, DEFAULT_PROFILE } from "shared/data/profiles";
import { Events } from "server/events";

const AUTOSAVE_INTERVAL = 300; // 5 minutes

@Service()
export class PlayerDataService implements OnStart, OnInit {
	private readonly dataStore = DataStoreService.GetDataStore("PlayerProfiles_v1");
	private readonly profiles = new Map<number, PlayerProfile>();
	private readonly serverSessionId = HttpService.GenerateGUID(false);

	public readonly onProfileLoaded: BindableEvent<(player: Player, profile: PlayerProfile) => void> = new Instance("BindableEvent");

	onInit() {
		game.BindToClose(() => {
			for (const player of Players.GetPlayers()) {
				this.saveProfile(player);
			}
			// Wait a bit to ensure requests fire (DataStore requests yield, so the loop + internal parallelism matters)
			// In a real scenario, we might want to use Promise.all or similar, but synchronous loop triggering async saves is common in BindToClose.
			// However, BindToClose has a 30s limit.
			task.wait(3);
		});
	}

	onStart() {
		Players.PlayerAdded.Connect((player) => this.loadProfile(player));
		Players.PlayerRemoving.Connect((player) => {
			this.saveProfile(player);
			this.profiles.delete(player.UserId);
		});

		for (const player of Players.GetPlayers()) {
			this.loadProfile(player);
		}

		// Autosave Loop
		task.spawn(() => {
			while (true) {
				task.wait(AUTOSAVE_INTERVAL);
				for (const player of Players.GetPlayers()) {
					this.saveProfile(player);
				}
			}
		});
	}

	private async loadProfile(player: Player, retries = 3): Promise<void> {
		const userId = player.UserId;
		const key = tostring(userId);

		try {
			const [data, info] = this.dataStore.GetAsync(key);

			if (data) {
				// Optimistic Locking: We are taking over.
				// In a stricter system, we might check if ActiveSessionId matches or is old/timed out.
				// Here we assume if the player joins this server, this server is authoritative.
				const profile = data as PlayerProfile;
				// Force update session ID in memory (will be saved next)
				const loadedProfile = {
					...profile,
					ActiveSessionId: this.serverSessionId,
					LastUpdateTimestamp: os.time(),
				};

				this.profiles.set(userId, loadedProfile);
				print(`[PlayerDataService] Loaded profile for ${player.Name}`);
				this.onProfileLoaded.Fire(player, loadedProfile);
				this.broadcastUpdate(player, loadedProfile);
			} else {
				const newProfile: PlayerProfile = {
					...DEFAULT_PROFILE,
					FirstSeen: os.time(),
					LastPlayed: os.time(),
					ActiveSessionId: this.serverSessionId,
					LastUpdateTimestamp: os.time(),
				};
				this.profiles.set(userId, newProfile);
				print(`[PlayerDataService] Created new profile for ${player.Name}`);
				this.onProfileLoaded.Fire(player, newProfile);
				this.broadcastUpdate(player, newProfile);
			}
		} catch (err) {
			warn(`[PlayerDataService] Failed to load profile for ${player.Name}: ${err}`);
			if (retries > 0) {
				task.wait(2);
				return this.loadProfile(player, retries - 1);
			} else {
				player.Kick("Failed to load player data. Please rejoin.");
			}
		}
	}

	private saveProfile(player: Player) {
		const userId = player.UserId;
		const profile = this.profiles.get(userId);
		if (!profile) return;

		const key = tostring(userId);

		try {
			this.dataStore.UpdateAsync(key, (oldData) => {
				const oldProfile = oldData as PlayerProfile | undefined;

				// Session Locking Check: reject if another session owns this data
				if (oldProfile && oldProfile.ActiveSessionId !== undefined) {
					if (oldProfile.ActiveSessionId !== this.serverSessionId) {
						// Another server owns this session - check if stale (>10 min)
						const lastUpdate = oldProfile.LastUpdateTimestamp ?? 0;
						const staleThreshold = 600; // 10 minutes
						if (os.time() - lastUpdate < staleThreshold) {
							warn(`[PlayerDataService] Session conflict for ${player.Name}, skipping save`);
							return $tuple(undefined); // Abort save
						}
					}
				}

				const updatedProfile: PlayerProfile = {
					...profile,
					LastPlayed: os.time(),
					LastUpdateTimestamp: os.time(),
					ActiveSessionId: this.serverSessionId,
				};

				return $tuple(updatedProfile);
			});
			print(`[PlayerDataService] Saved profile for ${player.Name}`);
		} catch (err) {
			warn(`[PlayerDataService] Failed to save profile for ${player.Name}: ${err}`);
		}
	}

	public getProfile(player: Player): PlayerProfile | undefined {
		return this.profiles.get(player.UserId);
	}

	public setClassLoadout(player: Player, classId: string, loadout: string[]) {
		const profile = this.profiles.get(player.UserId);
		if (!profile) return;

		// Ensure class record exists
		if (!profile.Classes[classId]) {
			profile.Classes[classId] = { Level: 1, XP: 0, Loadout: [] };
		}

		profile.Classes[classId] = {
			...profile.Classes[classId],
			Loadout: loadout,
		};
		// Trigger update
		this.broadcastUpdate(player, profile);
	}

	public addXP(player: Player, classId: string, amount: number) {
		const profile = this.profiles.get(player.UserId);
		if (!profile) return;

		if (!profile.Classes[classId]) {
			profile.Classes[classId] = { Level: 1, XP: 0, Loadout: [] };
		}

		const currentClass = profile.Classes[classId];
		let newXP = currentClass.XP + amount;
		let newLevel = currentClass.Level;

		// Simple level curve: 100 * Level
		// Level 1 -> 2 needs 100 XP
		// Level 2 -> 3 needs 200 XP
		let xpToNext = 100 * newLevel;

		while (newXP >= xpToNext) {
			newXP -= xpToNext;
			newLevel++;
			xpToNext = 100 * newLevel;
			print(`[PlayerDataService] ${player.Name} leveled up to ${newLevel} on ${classId}!`);
		}

		profile.Classes[classId] = {
			...currentClass,
			XP: newXP,
			Level: newLevel,
		};
		// Trigger update
		this.broadcastUpdate(player, profile);
	}

	public setSelectedClass(player: Player, classId: string) {
		const profile = this.profiles.get(player.UserId);
		if (!profile) return;

		// Replace entire profile to avoid mutating readonly Global
		const updatedProfile: PlayerProfile = {
			...profile,
			Global: {
				...profile.Global,
				LastSelectedClassId: classId,
			},
		};
		this.profiles.set(player.UserId, updatedProfile);
		this.broadcastUpdate(player, updatedProfile);
	}

	private broadcastUpdate(player: Player, profile: PlayerProfile) {
		Events.ProfileUpdated.fire(player, profile);
	}
}

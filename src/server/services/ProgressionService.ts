import { Service, OnStart } from "@flamework/core";
import { calculateTeamLevelProgress } from "../../shared/algorithms/progression/xp-math";
import { Log } from "../../shared/utils/log";

@Service({})
export class ProgressionService implements OnStart {
	private currentXP = 0;
	private teamLevel = 1;

	onStart() {
		Log.info("ProgressionService started");
	}

	public addXP(amount: number) {
		this.currentXP += amount;
		const progress = calculateTeamLevelProgress(this.currentXP, this.teamLevel);

		if (progress.levelUp) {
			this.handleLevelUp();
		}
	}

	public addMetaXP(userId: number, amount: number) {
		Log.info(`Adding ${amount} Meta-XP to ${userId}`);
		// Real impl: update profile, check meta-level, commit to DataService
	}

	private handleLevelUp() {
		this.teamLevel++;
		this.currentXP = 0; // Reset or carry over
		Log.info(`TEAM LEVEL UP: ${this.teamLevel}`);

		// Trigger simultaneous choices
		// In real impl: loop players, generate choices, fire LevelUpChoiceStarted
	}
}
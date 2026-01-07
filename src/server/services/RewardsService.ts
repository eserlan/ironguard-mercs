import { Service } from "@flamework/core";
import { calculateMissionRewards } from "../../shared/algorithms/rewards";
import { Log } from "../../shared/utils/log";

@Service({})
export class RewardsService {
    public grantRewards(waves: number) {
        // Placeholder values for base rewards
        const result = calculateMissionRewards(waves * 10, waves * 5, "Standard");
        Log.info(`Granting ${result.gold} coins and ${result.xp} XP`);
    }
}

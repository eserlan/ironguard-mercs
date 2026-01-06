import { Service } from "@flamework/core";
import { calculateRewards } from "../../shared/algorithms/rewards";
import { Log } from "../../shared/utils/log";

@Service({})
export class RewardsService {
    public grantRewards(waves: number) {
        const amount = calculateRewards(waves);
        Log.info(`Granting ${amount} coins`);
    }
}

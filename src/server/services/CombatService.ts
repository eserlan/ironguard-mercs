import { Service } from "@flamework/core";
import { validateIntent } from "../../shared/algorithms/combat/validation";
import { Log } from "../../shared/utils/log";

@Service({})
export class CombatService {
    public processIntent(player: Player, intent: any) {
        if (!validateIntent(intent, os.clock())) {
            Log.warn("Invalid intent");
            return;
        }
        // Logic...
    }
}
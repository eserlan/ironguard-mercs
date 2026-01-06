import { Service } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class CombatLogging {
    public logSuspicion(player: Player, reason: string) {
        Log.warn(`Suspicious combat: ${player} - ${reason}`);
    }
}

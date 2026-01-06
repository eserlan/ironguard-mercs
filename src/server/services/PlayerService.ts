import { Service, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class PlayerService implements OnStart {
    onStart() {
        Log.info("PlayerService started");
    }
}

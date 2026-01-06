import { Service } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Service({})
export class DungeonService {
    public generate() {
        Log.info("Generating dungeon...");
    }
}

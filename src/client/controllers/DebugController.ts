import { Controller, OnStart } from "@flamework/core";
import { Log } from "../../shared/utils/log";

@Controller({})
export class DebugController implements OnStart {
    onStart() {
        Log.info("Debug Overlay initialized");
        // Log.info("Current Class: ... Slots: ...");
    }
}

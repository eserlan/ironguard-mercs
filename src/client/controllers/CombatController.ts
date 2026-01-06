import { Controller, OnStart } from "@flamework/core";

@Controller({})
export class CombatController implements OnStart {
    onStart() {
        // ContextActionService.bind(...)
    }
}

import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { RunService } from "./RunService";
import { ClassService } from "./ClassService";
import { GearService } from "./GearService";
import { Log } from "../../shared/utils/log";

@Service({})
export class InitializerService implements OnStart {
    constructor(
        private runService: RunService,
        private classService: ClassService,
        private gearService: GearService,
    ) { }

    onStart() {
        Players.PlayerAdded.Connect((player) => {
            player.CharacterAdded.Connect((character) => {
                this.onCharacterAdded(player, character);
            });
        });

        // Handle existing players
        for (const player of Players.GetPlayers()) {
            if (player.Character) {
                this.onCharacterAdded(player, player.Character);
            }
            player.CharacterAdded.Connect((character) => {
                this.onCharacterAdded(player, character);
            });
        }
    }

    private onCharacterAdded(player: Player, character: Model) {
        const sessionMember = this.runService.getSessionMember(player.UserId);
        if (!sessionMember) {
            Log.info(`No session data for ${player.Name}, skipping initialization`);
            return;
        }

        Log.info(`Initializing character for ${player.Name} (${sessionMember.selectedMercenaryId})`);

        // 1. Apply Class
        if (sessionMember.selectedMercenaryId) {
            this.classService.applyClassToPlayer(player, sessionMember.selectedMercenaryId);
        }

        // 2. Apply Gear
        if (sessionMember.loadout) {
            this.gearService.applyLoadoutToPlayer(player, sessionMember.loadout);
        }
    }
}

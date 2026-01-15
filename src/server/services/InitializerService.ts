import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { RunService } from "./RunService";
import { ClassService } from "./ClassService";
import { GearService } from "./GearService";
import { PlayerVisualService } from "./PlayerVisualService";
import { Log } from "../../shared/utils/log";

@Service({})
export class InitializerService implements OnStart {
    constructor(
        private runService: RunService,
        private classService: ClassService,
        private gearService: GearService,
        private playerVisualService: PlayerVisualService,
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

        if (sessionMember) {
            Log.info(`Initializing character for ${player.Name} (${sessionMember.selectedMercenaryId}) [Session Active]`);

            // 1. Apply Class
            if (sessionMember.selectedMercenaryId) {
                this.classService.applyClassToPlayer(player, sessionMember.selectedMercenaryId);
            }

            // 2. Apply Gear
            if (sessionMember.loadout) {
                this.gearService.applyLoadoutToPlayer(player, sessionMember.loadout);
            }

            // 3. Apply Visuals
            // TODO: Derive current weapon from Loadout
            this.playerVisualService.applyWeaponModel(player, "BasicHit");

        } else if (this.runService.isSafeRoom()) {
            // Lobby / Safe Room Fallback
            Log.info(`Initializing character for ${player.Name} [Lobby Mode]`);

            // For now, default to Sword visuals in Lobby so they see something
            this.playerVisualService.applyWeaponModel(player, "BasicHit");
        } else {
            Log.info(`No session data for ${player.Name} and not in Safe Room, skipping initialization`);
        }
    }
}

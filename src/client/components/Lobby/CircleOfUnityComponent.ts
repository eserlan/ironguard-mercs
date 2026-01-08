import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Events } from "client/events";
import { Players, RunService } from "@rbxts/services";
import { Log } from "shared/utils/log";

const DETECTION_INTERVAL_SECONDS = 0.5;

@Component({
    tag: "LobbyCircleOfUnity",
})
export class CircleOfUnityComponent extends BaseComponent<object, BasePart> implements OnStart {
    private playersOnPad = new Set<Player>();
    private timeSinceLastCheck = 0;

    onStart() {
        Log.info(`[Lobby] CircleOfUnity component started on: ${this.instance.GetFullName()}`);

        RunService.Heartbeat.Connect((dt) => {
            this.timeSinceLastCheck += dt;
            if (this.timeSinceLastCheck >= DETECTION_INTERVAL_SECONDS) {
                this.timeSinceLastCheck = 0;
                this.updateDetection();
            }
        });
    }

    private updateDetection() {
        const parts = game.Workspace.GetPartsInPart(this.instance);
        const currentPlayers = new Set<Player>();

        for (const part of parts) {
            const character = part.Parent;
            if (character && character.IsA("Model")) {
                const player = Players.GetPlayerFromCharacter(character);
                if (player) {
                    currentPlayers.add(player);
                }
            }
        }

        // Local player logic
        const localPlayer = Players.LocalPlayer;
        const wasOnPad = this.playersOnPad.has(localPlayer);
        const isOnPad = currentPlayers.has(localPlayer);

        if (!wasOnPad && isOnPad) {
            Log.info("[Lobby] CircleOfUnity - player stepped into the MOSAIC");
            Events.StepOnPad();
        } else if (wasOnPad && !isOnPad) {
            Log.info("[Lobby] CircleOfUnity - player stepped out of the MOSAIC");
            Events.StepOffPad();
        }

        this.playersOnPad = currentPlayers;
    }
}

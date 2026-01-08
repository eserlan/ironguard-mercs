import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";
import { LobbyController } from "client/controllers/LobbyController";
import { MissionMode } from "shared/domain/party/party-types";
import { Log } from "shared/utils/log";

// Mode display config
const MODE_CONFIG: Record<MissionMode, { name: string; description: string; color: Color3; bellColor: Color3 }> = {
    [MissionMode.Standard]: {
        name: "STANDARD",
        description: "Follow the path of light.\nDowned mercenaries can be revived.\nProgress is saved between runs.",
        color: Color3.fromRGB(255, 255, 255),
        bellColor: Color3.fromRGB(150, 150, 150),
    },
    [MissionMode.Ironman]: {
        name: "BLACK BELL",
        description: "A pact with the void!\nPermadeath: fallen mercenaries are lost forever.\nHigher rewards and eternal glory.",
        color: Color3.fromRGB(255, 100, 100),
        bellColor: Color3.fromRGB(40, 40, 40),
    },
};

@Component({
    tag: "LobbyBlackBell",
})
export class BlackBellComponent extends StationComponent {
    private bell?: BasePart;
    private textLabels: TextLabel[] = [];
    private descriptionLabel?: TextLabel;

    constructor(lobbyController: LobbyController) {
        super(lobbyController);
    }

    onStart() {
        super.onStart();
        Log.info("[Lobby] BlackBell component started");

        // The component is attached to the Bell part
        this.bell = this.instance as BasePart;

        // Create SurfaceGuis on front and back
        const faces = [Enum.NormalId.Front, Enum.NormalId.Back];
        for (const face of faces) {
            const surfaceGui = new Instance("SurfaceGui");
            surfaceGui.Name = `ModeGui_${face.Name}`;
            surfaceGui.Face = face;
            surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
            surfaceGui.PixelsPerStud = 50;
            surfaceGui.Parent = this.bell;

            const textLabel = new Instance("TextLabel");
            textLabel.Name = "ModeText";
            textLabel.Size = new UDim2(1, 0, 1, 0);
            textLabel.BackgroundTransparency = 1;
            textLabel.Font = Enum.Font.GothamBold;
            textLabel.TextScaled = true;
            textLabel.Text = "STANDARD";
            textLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
            textLabel.Parent = surfaceGui;

            this.textLabels.push(textLabel);
        }

        // Create BillboardGui for description
        this.createDescriptionBillboard();

        // Set initial display
        this.updateModeDisplay(MissionMode.Standard);

        this.lobbyController.subscribe((state) => {
            const mode = state.room?.mode ?? MissionMode.Standard;
            this.instance.SetAttribute("Mode", mode);
            this.updateModeDisplay(mode);
        });
    }

    private createDescriptionBillboard() {
        const billboardGui = new Instance("BillboardGui");
        billboardGui.Name = "ModeDescriptionGui";
        billboardGui.Size = new UDim2(0, 400, 0, 150);
        billboardGui.StudsOffset = new Vector3(0, 4, 0);
        billboardGui.AlwaysOnTop = false;
        billboardGui.MaxDistance = 25;
        billboardGui.Parent = this.bell;

        const frame = new Instance("Frame");
        frame.Name = "Background";
        frame.Size = new UDim2(1, 0, 1, 0);
        frame.BackgroundColor3 = Color3.fromRGB(30, 30, 30);
        frame.BackgroundTransparency = 0.3;
        frame.BorderSizePixel = 0;
        frame.Parent = billboardGui;

        const corner = new Instance("UICorner");
        corner.CornerRadius = new UDim(0, 8);
        corner.Parent = frame;

        const padding = new Instance("UIPadding");
        padding.PaddingTop = new UDim(0, 12);
        padding.PaddingBottom = new UDim(0, 12);
        padding.PaddingLeft = new UDim(0, 16);
        padding.PaddingRight = new UDim(0, 16);
        padding.Parent = frame;

        const descLabel = new Instance("TextLabel");
        descLabel.Name = "DescriptionText";
        descLabel.Size = new UDim2(1, 0, 1, 0);
        descLabel.BackgroundTransparency = 1;
        descLabel.Font = Enum.Font.GothamMedium;
        descLabel.TextSize = 22;
        descLabel.TextWrapped = true;
        descLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
        descLabel.TextXAlignment = Enum.TextXAlignment.Center;
        descLabel.TextYAlignment = Enum.TextYAlignment.Center;
        descLabel.Text = "";
        descLabel.Parent = frame;

        this.descriptionLabel = descLabel;
    }

    private updateModeDisplay(mode: MissionMode) {
        const config = MODE_CONFIG[mode] ?? MODE_CONFIG[MissionMode.Standard];

        if (this.bell) {
            this.bell.Color = config.bellColor;
        }

        for (const textLabel of this.textLabels) {
            textLabel.Text = config.name;
            textLabel.TextColor3 = config.color;
        }

        if (this.descriptionLabel) {
            this.descriptionLabel.Text = config.description;
            this.descriptionLabel.TextColor3 = config.color;
        }
    }

    protected onTriggered() {
        Log.info("[Lobby] BlackBell triggered");
        const state = this.lobbyController.getState();
        if (!state.room) {
            Log.warn("[Lobby] BlackBell - no room, ignoring");
            return;
        }

        const nextMode = state.room.mode === MissionMode.Standard ? MissionMode.Ironman : MissionMode.Standard;
        Log.info(`[Lobby] BlackBell - toggling to mode: ${nextMode}`);
        this.lobbyController.setMissionMode(nextMode);
    }
}

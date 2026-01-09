import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";
import { LobbyController } from "client/controllers/LobbyController";
import { Log } from "shared/utils/log";

// Difficulty config with colors, names, and thematic descriptions
const DIFFICULTY_CONFIG = [
    {
        name: "I: BLESSING OF THE SUN",
        color: Color3.fromRGB(0, 255, 100),
        description: "A gentle wind guides your blade.\nEnemies deal less damage.\nGreat for initiates.",
    },
    {
        name: "II: CALL TO VALOR",
        color: Color3.fromRGB(255, 255, 0),
        description: "The standard trials of a mercenary.\nBalanced challenge for true heroes.",
    },
    {
        name: "III: SCENT OF AMBITION",
        color: Color3.fromRGB(255, 165, 0),
        description: "Greater rewards for those who risk all.\nEnemies hit harder and have more health.",
    },
    {
        name: "IV: ECHOES OF CALAMITY",
        color: Color3.fromRGB(255, 50, 50),
        description: "The mountain trembles.\nRequires skilled play and perfect coordination.",
    },
    {
        name: "V: WRATH OF THE HEAVENS",
        color: Color3.fromRGB(180, 0, 255),
        description: "Only the legends survive here.\nOne mistake can be fatal. Best rewards.",
    },
];

const FACES: Enum.NormalId[] = [
    Enum.NormalId.Front,
    Enum.NormalId.Back,
    Enum.NormalId.Left,
    Enum.NormalId.Right,
];

@Component({
    tag: "LobbyPillarOfFate",
})
export class PillarOfFateComponent extends StationComponent<object, Model | BasePart> {
    private crystal?: BasePart;
    private pillar?: BasePart;
    private pointLight?: PointLight;
    private textLabels: TextLabel[] = [];
    private titleLabel?: TextLabel;
    private descriptionLabel?: TextLabel;

    constructor(lobbyController: LobbyController) {
        super(lobbyController);
    }

    onStart() {
        super.onStart();
        Log.info(`[Lobby] PillarOfFate component started on ${this.instance.ClassName}: ${this.instance.Name}`);

        if (this.instance.IsA("Model")) {
            // Component tag is on the Model (DifficultyPedestal)
            this.crystal = this.instance.FindFirstChild("Crystal") as BasePart | undefined;
            this.pillar = this.instance.FindFirstChild("Pillar") as BasePart | undefined;
        } else if (this.instance.IsA("BasePart")) {
            // Component tag is on the Part (Crystal), legacy/fallback
            const parent = this.instance.Parent as Model;
            this.crystal = this.instance;
            if (parent) {
                this.pillar = parent.FindFirstChild("Pillar") as BasePart | undefined;
            }
        }

        if (this.crystal) {
            this.pointLight = this.crystal.FindFirstChildWhichIsA("PointLight") as PointLight | undefined;
        } else {
            Log.warn("[Lobby] PillarOfFate: Crystal part not found!");
        }

        // Create SurfaceGuis with TextLabels on each face of the pillar
        if (this.pillar) {
            for (const face of FACES) {
                const surfaceGui = new Instance("SurfaceGui");
                surfaceGui.Name = `DifficultyGui_${face.Name}`;
                surfaceGui.Face = face;
                surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
                surfaceGui.PixelsPerStud = 50;
                surfaceGui.Parent = this.pillar;

                const textLabel = new Instance("TextLabel");
                textLabel.Name = "DifficultyText";
                textLabel.Size = new UDim2(1, 0, 1, 0);
                textLabel.BackgroundTransparency = 1;
                textLabel.Font = Enum.Font.GothamBold;
                textLabel.TextScaled = true;
                textLabel.Text = "1";
                textLabel.TextColor3 = DIFFICULTY_CONFIG[0].color;
                textLabel.Parent = surfaceGui;

                this.textLabels.push(textLabel);
            }
        }

        // Create BillboardGui for difficulty description
        this.createDescriptionBillboard();

        // Set initial difficulty display
        this.updateDifficultyDisplay(1);

        this.lobbyController.subscribe((state) => {
            const difficulty = state.room?.difficulty ?? state.soloDifficulty ?? 1;
            this.instance.SetAttribute("Difficulty", difficulty);
            this.updateDifficultyDisplay(difficulty);
        });
    }

    private createDescriptionBillboard() {
        if (!this.crystal) return;

        const billboardGui = new Instance("BillboardGui");
        billboardGui.Name = "PillarDescriptionGui";
        billboardGui.Size = new UDim2(0, 400, 0, 150);
        billboardGui.StudsOffset = new Vector3(0, 3, 0); // Float above crystal
        billboardGui.AlwaysOnTop = false;
        billboardGui.MaxDistance = 25;
        billboardGui.Parent = this.crystal;

        // Background frame
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
        padding.PaddingTop = new UDim(0, 10);
        padding.PaddingBottom = new UDim(0, 10);
        padding.PaddingLeft = new UDim(0, 16);
        padding.PaddingRight = new UDim(0, 16);
        padding.Parent = frame;

        const layout = new Instance("UIListLayout");
        layout.FillDirection = Enum.FillDirection.Vertical;
        layout.HorizontalAlignment = Enum.HorizontalAlignment.Center;
        layout.VerticalAlignment = Enum.VerticalAlignment.Center;
        layout.Padding = new UDim(0, 4);
        layout.Parent = frame;

        // Title (difficulty name)
        const titleLabel = new Instance("TextLabel");
        titleLabel.Name = "TitleText";
        titleLabel.Size = new UDim2(1, 0, 0, 30);
        titleLabel.BackgroundTransparency = 1;
        titleLabel.Font = Enum.Font.GothamBold;
        titleLabel.TextSize = 24;
        titleLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
        titleLabel.Text = "";
        titleLabel.Parent = frame;

        this.titleLabel = titleLabel;

        // Description text
        const descLabel = new Instance("TextLabel");
        descLabel.Name = "DescriptionText";
        descLabel.Size = new UDim2(1, 0, 0, 80);
        descLabel.BackgroundTransparency = 1;
        descLabel.Font = Enum.Font.GothamMedium;
        descLabel.TextSize = 18;
        descLabel.TextWrapped = true;
        descLabel.TextColor3 = Color3.fromRGB(220, 220, 220);
        descLabel.TextXAlignment = Enum.TextXAlignment.Center;
        descLabel.TextYAlignment = Enum.TextYAlignment.Top;
        descLabel.Text = "";
        descLabel.Parent = frame;

        this.descriptionLabel = descLabel;
    }

    private updateDifficultyDisplay(difficulty: number) {
        const config = DIFFICULTY_CONFIG[difficulty - 1] ?? DIFFICULTY_CONFIG[0];

        // Update crystal color
        if (this.crystal) {
            this.crystal.Color = config.color;
        }

        // Update point light color
        if (this.pointLight) {
            this.pointLight.Color = config.color;
        }

        // Update all pillar text labels
        for (const textLabel of this.textLabels) {
            textLabel.Text = tostring(difficulty);
            textLabel.TextColor3 = config.color;
        }

        // Update billboard
        if (this.titleLabel) {
            this.titleLabel.Text = config.name;
            this.titleLabel.TextColor3 = config.color;
        }
        if (this.descriptionLabel) {
            this.descriptionLabel.Text = config.description;
        }
    }

    protected onTriggered() {
        Log.info("[Lobby] PillarOfFate triggered");
        const state = this.lobbyController.getState();

        // Get current difficulty from room or solo state
        const currentDifficulty = state.room?.difficulty ?? state.soloDifficulty ?? 1;

        // Cycle 1-5
        let nextDifficulty = currentDifficulty + 1;
        if (nextDifficulty > 5) nextDifficulty = 1;

        Log.info(`[Lobby] PillarOfFate - cycling to difficulty: ${nextDifficulty}`);
        this.lobbyController.setDifficulty(nextDifficulty);
    }
}


import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";
import { LobbyController } from "client/controllers/LobbyController";
import { Players } from "@rbxts/services";
import { ClassRegistry } from "shared/domain/classes/config";
import { Log } from "shared/utils/log";

@Component({
    tag: "LobbyRosterAltar",
})
export class RosterAltarComponent extends StationComponent {
    private surfaceGui?: SurfaceGui;
    private surfaceFrame?: Frame;
    private surfaceButtons = new Map<string, TextButton>(); // classId -> button
    private detailNameLabel?: TextLabel;
    private detailRoleLabel?: TextLabel;
    private detailInfoLabel?: TextLabel;
    private currentUnlockedIds: string[] = [];

    constructor(lobbyController: LobbyController) {
        super(lobbyController);
    }

    onStart() {
        super.onStart();
        Log.info("[Lobby] RosterAltar component started");

        const altar = this.instance as BasePart;

        // Create SurfaceGui on the altar showing class list
        this.createSurfaceList(altar);

        // Create BillboardGui floating above with detailed info
        this.createDetailBillboard(altar);

        // Update when state changes (unlocked classes or selection)
        this.lobbyController.subscribe((state) => {
            const selectedId = state.room?.members.find(m => m.playerId === tostring(Players.LocalPlayer.UserId))?.selectedMercenaryId
                ?? state.soloMercenaryId;

            // Rebuild list if unlocked classes changed
            if (!this.arraysEqual(state.unlockedClassIds, this.currentUnlockedIds)) {
                this.currentUnlockedIds = [...state.unlockedClassIds];
                this.rebuildClassList();
            }

            this.updateSelection(selectedId);
        });
    }

    private arraysEqual(a: string[], b: string[]): boolean {
        if (a.size() !== b.size()) return false;
        for (let i = 0; i < a.size(); i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    private createSurfaceList(altar: BasePart) {
        const surfaceGui = new Instance("SurfaceGui");
        surfaceGui.Name = "RosterListSurface";
        surfaceGui.Face = Enum.NormalId.Front;
        surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
        surfaceGui.PixelsPerStud = 40;
        surfaceGui.Parent = altar;

        // IMPORTANT: Make SurfaceGui interactive so buttons can be clicked
        surfaceGui.Active = true;

        this.surfaceGui = surfaceGui;

        // Background frame
        const frame = new Instance("Frame");
        frame.Name = "Background";
        frame.Size = new UDim2(1, 0, 1, 0);
        frame.BackgroundColor3 = Color3.fromRGB(20, 20, 25);
        frame.BackgroundTransparency = 0.2;
        frame.BorderSizePixel = 0;
        frame.Parent = surfaceGui;

        const padding = new Instance("UIPadding");
        padding.PaddingTop = new UDim(0.02, 0);
        padding.PaddingBottom = new UDim(0.1, 0);
        padding.PaddingLeft = new UDim(0.1, 0);
        padding.PaddingRight = new UDim(0.1, 0);
        padding.Parent = frame;

        const layout = new Instance("UIListLayout");
        layout.FillDirection = Enum.FillDirection.Vertical;
        layout.HorizontalAlignment = Enum.HorizontalAlignment.Center;
        layout.VerticalAlignment = Enum.VerticalAlignment.Top;
        layout.SortOrder = Enum.SortOrder.LayoutOrder;
        layout.Padding = new UDim(0, 8);
        layout.Parent = frame;

        // Title
        const titleLabel = new Instance("TextLabel");
        titleLabel.Name = "Title";
        titleLabel.Size = new UDim2(1, 0, 0, 30);
        titleLabel.BackgroundTransparency = 1;
        titleLabel.Font = Enum.Font.GothamBold;
        titleLabel.TextScaled = true;
        titleLabel.TextColor3 = Color3.fromRGB(255, 200, 100);
        titleLabel.Text = "SANCTUARY ROSTER";
        titleLabel.LayoutOrder = 0;
        titleLabel.Parent = frame;

        this.surfaceFrame = frame;

        // Build initial class list
        this.rebuildClassList();
    }

    private rebuildClassList() {
        if (!this.surfaceFrame) return;

        // Clear existing class buttons
        for (const [, button] of this.surfaceButtons) {
            button.Destroy();
        }
        this.surfaceButtons.clear();

        // Get unlocked classes from registry
        const allClasses = ClassRegistry.getAll();
        const unlockedClasses = allClasses.filter(c => this.currentUnlockedIds.includes(c.id));

        Log.info(`[RosterAltar] Building list with ${unlockedClasses.size()} unlocked classes`);

        // Create buttons for each unlocked class
        let order = 1;
        for (const classConfig of unlockedClasses) {
            const classButton = new Instance("TextButton");
            classButton.Name = `Class_${classConfig.id}`;
            classButton.Size = new UDim2(1, 0, 0, 28);
            classButton.BackgroundColor3 = Color3.fromRGB(40, 40, 50);
            classButton.BackgroundTransparency = 0.5;
            classButton.BorderSizePixel = 0;
            classButton.Font = Enum.Font.Gotham;
            classButton.TextScaled = true;
            classButton.TextColor3 = Color3.fromRGB(180, 180, 180);
            classButton.Text = classConfig.name;
            classButton.LayoutOrder = order++;
            classButton.AutoButtonColor = true;
            classButton.Parent = this.surfaceFrame;

            // Add corner radius
            const corner = new Instance("UICorner");
            corner.CornerRadius = new UDim(0, 4);
            corner.Parent = classButton;

            // Handle click to select this class
            const classId = classConfig.id;
            classButton.MouseButton1Click.Connect(() => {
                Log.info(`[RosterAltar] Class selected: ${classId}`);
                this.lobbyController.selectMercenary(classId);
            });

            this.surfaceButtons.set(classConfig.id, classButton);
        }

        // Re-apply selection styling
        const state = this.lobbyController.getState();
        const selectedId = state.room?.members.find(m => m.playerId === tostring(Players.LocalPlayer.UserId))?.selectedMercenaryId
            ?? state.soloMercenaryId;
        this.updateSelection(selectedId);
    }

    private createDetailBillboard(altar: BasePart) {
        const billboardGui = new Instance("BillboardGui");
        billboardGui.Name = "RosterDetailGui";
        billboardGui.Size = new UDim2(0, 350, 0, 140);
        billboardGui.StudsOffset = new Vector3(0, 6, 0); // High above the altar
        billboardGui.AlwaysOnTop = false;
        billboardGui.MaxDistance = 25;
        billboardGui.Parent = altar;

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
        padding.PaddingTop = new UDim(0, 12);
        padding.PaddingBottom = new UDim(0, 12);
        padding.PaddingLeft = new UDim(0, 16);
        padding.PaddingRight = new UDim(0, 16);
        padding.Parent = frame;

        const layout = new Instance("UIListLayout");
        layout.FillDirection = Enum.FillDirection.Vertical;
        layout.HorizontalAlignment = Enum.HorizontalAlignment.Center;
        layout.VerticalAlignment = Enum.VerticalAlignment.Center;
        layout.Padding = new UDim(0, 4);
        layout.Parent = frame;

        // Selected class name
        const nameLabel = new Instance("TextLabel");
        nameLabel.Name = "ClassName";
        nameLabel.Size = new UDim2(1, 0, 0, 32);
        nameLabel.BackgroundTransparency = 1;
        nameLabel.Font = Enum.Font.GothamBold;
        nameLabel.TextSize = 26;
        nameLabel.TextColor3 = Color3.fromRGB(100, 255, 100);
        nameLabel.Text = "Pledge a Hero";
        nameLabel.Parent = frame;

        this.detailNameLabel = nameLabel;

        // Class role
        const roleLabel = new Instance("TextLabel");
        roleLabel.Name = "ClassRole";
        roleLabel.Size = new UDim2(1, 0, 0, 20);
        roleLabel.BackgroundTransparency = 1;
        roleLabel.Font = Enum.Font.GothamMedium;
        roleLabel.TextSize = 16;
        roleLabel.TextColor3 = Color3.fromRGB(180, 180, 180);
        roleLabel.Text = "";
        roleLabel.Parent = frame;

        this.detailRoleLabel = roleLabel;

        // Detailed info (stats)
        const infoLabel = new Instance("TextLabel");
        infoLabel.Name = "ClassStats";
        infoLabel.Size = new UDim2(1, 0, 0, 50);
        infoLabel.BackgroundTransparency = 1;
        infoLabel.Font = Enum.Font.GothamMedium;
        infoLabel.TextSize = 18;
        infoLabel.TextWrapped = true;
        infoLabel.TextColor3 = Color3.fromRGB(200, 200, 200);
        infoLabel.Text = "Press E to pledge";
        infoLabel.Parent = frame;

        this.detailInfoLabel = infoLabel;
    }

    private updateSelection(selectedId?: string) {
        const selectedClass = selectedId ? ClassRegistry.get(selectedId) : undefined;

        // Update surface buttons (bold for selected)
        for (const [classId, button] of this.surfaceButtons) {
            const isSelected = classId === selectedId;

            if (isSelected) {
                button.Font = Enum.Font.GothamBold;
                button.TextColor3 = Color3.fromRGB(100, 255, 100);
                button.BackgroundColor3 = Color3.fromRGB(40, 80, 50);
                button.BackgroundTransparency = 0.3;
            } else {
                button.Font = Enum.Font.Gotham;
                button.TextColor3 = Color3.fromRGB(180, 180, 180);
                button.BackgroundColor3 = Color3.fromRGB(40, 40, 50);
                button.BackgroundTransparency = 0.5;
            }
        }

        // Update detail billboard
        if (selectedClass) {
            if (this.detailNameLabel) {
                this.detailNameLabel.Text = selectedClass.name;
                this.detailNameLabel.TextColor3 = Color3.fromRGB(100, 255, 100);
            }
            if (this.detailRoleLabel) {
                this.detailRoleLabel.Text = selectedClass.role ?? "";
            }
            if (this.detailInfoLabel) {
                const stats = selectedClass.baseStats;
                const statsText = stats
                    ? `HP: ${stats.hp ?? "?"} | SPD: ${stats.speed ?? "?"} | DEF: ${stats.defense ?? "?"}`
                    : "";
                this.detailInfoLabel.Text = statsText;
            }
        } else {
            if (this.detailNameLabel) {
                this.detailNameLabel.Text = "Pledge a Hero";
                this.detailNameLabel.TextColor3 = Color3.fromRGB(200, 200, 200);
            }
            if (this.detailRoleLabel) {
                this.detailRoleLabel.Text = "";
            }
            if (this.detailInfoLabel) {
                this.detailInfoLabel.Text = "Press E to pledge";
            }
        }
    }

    protected onTriggered() {
        Log.info("[Lobby] RosterAltar triggered - opening Roster Altar station");
        this.openStation("Roster Altar");
    }
}

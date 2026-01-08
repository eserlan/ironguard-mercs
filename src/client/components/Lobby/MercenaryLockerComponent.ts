import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";
import { LobbyController } from "client/controllers/LobbyController";
import { Players } from "@rbxts/services";
import { ClassRegistry } from "shared/domain/classes/config";
import { Log } from "shared/utils/log";

@Component({
	tag: "LobbyMercenaryLocker",
})
export class MercenaryLockerComponent extends StationComponent {
	private surfaceFrame?: Frame;
	private surfaceLabels = new Map<string, TextLabel>(); // classId -> label
	private detailNameLabel?: TextLabel;
	private detailRoleLabel?: TextLabel;
	private detailInfoLabel?: TextLabel;
	private currentUnlockedIds: string[] = [];

	constructor(lobbyController: LobbyController) {
		super(lobbyController);
	}

	onStart() {
		super.onStart();
		Log.info("[Lobby] MercenaryLocker component started");

		const locker = this.instance as BasePart;

		// Create SurfaceGui on the locker showing class list
		this.createSurfaceList(locker);

		// Create BillboardGui floating above with detailed info
		this.createDetailBillboard(locker);

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

	private createSurfaceList(locker: BasePart) {
		const surfaceGui = new Instance("SurfaceGui");
		surfaceGui.Name = "MercenaryListSurface";
		surfaceGui.Face = Enum.NormalId.Front;
		surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
		surfaceGui.PixelsPerStud = 40;
		surfaceGui.Parent = locker;

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
		titleLabel.Text = "ROSTER";
		titleLabel.LayoutOrder = 0;
		titleLabel.Parent = frame;

		this.surfaceFrame = frame;

		// Build initial class list
		this.rebuildClassList();
	}

	private rebuildClassList() {
		if (!this.surfaceFrame) return;

		// Clear existing class labels
		for (const [, label] of this.surfaceLabels) {
			label.Destroy();
		}
		this.surfaceLabels.clear();

		// Get unlocked classes from registry
		const allClasses = ClassRegistry.getAll();
		const unlockedClasses = allClasses.filter(c => this.currentUnlockedIds.includes(c.id));

		Log.info(`[MercLocker] Building list with ${unlockedClasses.size()} unlocked classes`);

		// Create labels for each unlocked class
		let order = 1;
		for (const classConfig of unlockedClasses) {
			const classLabel = new Instance("TextLabel");
			classLabel.Name = `Class_${classConfig.id}`;
			classLabel.Size = new UDim2(1, 0, 0, 28);
			classLabel.BackgroundTransparency = 1;
			classLabel.Font = Enum.Font.Gotham;
			classLabel.TextScaled = true;
			classLabel.TextColor3 = Color3.fromRGB(180, 180, 180);
			classLabel.Text = classConfig.name;
			classLabel.LayoutOrder = order++;
			classLabel.Parent = this.surfaceFrame;

			this.surfaceLabels.set(classConfig.id, classLabel);
		}

		// Re-apply selection styling
		const state = this.lobbyController.getState();
		const selectedId = state.room?.members.find(m => m.playerId === tostring(Players.LocalPlayer.UserId))?.selectedMercenaryId
			?? state.soloMercenaryId;
		this.updateSelection(selectedId);
	}

	private createDetailBillboard(locker: BasePart) {
		const billboardGui = new Instance("BillboardGui");
		billboardGui.Name = "MercenaryDetailGui";
		billboardGui.Size = new UDim2(0, 350, 0, 140);
		billboardGui.StudsOffset = new Vector3(0, 6, 0); // High above the locker
		billboardGui.AlwaysOnTop = false;
		billboardGui.MaxDistance = 25;
		billboardGui.Parent = locker;

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
		nameLabel.Text = "Select a Class";
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
		infoLabel.Text = "Press E to select";
		infoLabel.Parent = frame;

		this.detailInfoLabel = infoLabel;
	}

	private updateSelection(selectedId?: string) {
		const selectedClass = selectedId ? ClassRegistry.get(selectedId) : undefined;

		// Update surface labels (bold for selected)
		for (const [classId, label] of this.surfaceLabels) {
			const isSelected = classId === selectedId;

			if (isSelected) {
				label.Font = Enum.Font.GothamBold;
				label.TextColor3 = Color3.fromRGB(100, 255, 100);
			} else {
				label.Font = Enum.Font.Gotham;
				label.TextColor3 = Color3.fromRGB(180, 180, 180);
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
				this.detailNameLabel.Text = "Select a Class";
				this.detailNameLabel.TextColor3 = Color3.fromRGB(200, 200, 200);
			}
			if (this.detailRoleLabel) {
				this.detailRoleLabel.Text = "";
			}
			if (this.detailInfoLabel) {
				this.detailInfoLabel.Text = "Press E to select";
			}
		}
	}

	protected onTriggered() {
		Log.info("[Lobby] MercenaryLocker triggered - opening Locker station");
		this.openStation("Locker");
	}
}

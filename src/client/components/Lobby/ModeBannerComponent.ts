import { Component } from "@flamework/components";
import { StationComponent } from "./StationComponent";
import { LobbyController } from "client/controllers/LobbyController";
import { MissionMode } from "shared/domain/party/party-types";

// Mode display config
const MODE_CONFIG: Record<MissionMode, { name: string; description: string; color: Color3; bannerColor: Color3 }> = {
	[MissionMode.Standard]: {
		name: "STANDARD",
		description: "Normal difficulty.\nDowned mercenaries can be revived.\nProgress is saved between runs.",
		color: Color3.fromRGB(255, 255, 255),
		bannerColor: Color3.fromRGB(50, 100, 150), // Blue banner
	},
	[MissionMode.Ironman]: {
		name: "IRONMAN",
		description: "Hardcore mode!\nPermadeath: fallen mercenaries are lost forever.\nHigher rewards and glory.",
		color: Color3.fromRGB(255, 200, 50),
		bannerColor: Color3.fromRGB(150, 50, 50), // Red banner
	},
};

@Component({
	tag: "LobbyModeBanner",
})
export class ModeBannerComponent extends StationComponent {
	private banner?: BasePart;
	private textLabels: TextLabel[] = [];
	private descriptionLabel?: TextLabel;

	constructor(lobbyController: LobbyController) {
		super(lobbyController);
	}

	onStart() {
		super.onStart();
		print("[Lobby] ModeBanner component started");

		// The component is attached to Banner part
		this.banner = this.instance as BasePart;

		// Create SurfaceGuis on front and back of banner
		const faces = [Enum.NormalId.Front, Enum.NormalId.Back];
		for (const face of faces) {
			const surfaceGui = new Instance("SurfaceGui");
			surfaceGui.Name = `ModeGui_${face.Name}`;
			surfaceGui.Face = face;
			surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
			surfaceGui.PixelsPerStud = 50;
			surfaceGui.Parent = this.banner;

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

		// Create BillboardGui for mode description (floating above banner)
		this.createDescriptionBillboard();

		// Set initial mode display
		this.updateModeDisplay(MissionMode.Standard);

		this.lobbyController.subscribe((state) => {
			const mode = state.room?.mode ?? MissionMode.Standard;
			print(`[Lobby] ModeBanner - setting mode to: ${mode}`);
			this.instance.SetAttribute("Mode", mode);
			this.updateModeDisplay(mode);
		});
	}

	private createDescriptionBillboard() {
		const billboardGui = new Instance("BillboardGui");
		billboardGui.Name = "ModeDescriptionGui";
		billboardGui.Size = new UDim2(0, 400, 0, 150);
		billboardGui.StudsOffset = new Vector3(0, 4, 0); // Float above banner
		billboardGui.AlwaysOnTop = false;
		billboardGui.MaxDistance = 25; // Only visible when nearby
		billboardGui.Parent = this.banner;

		// Background frame
		const frame = new Instance("Frame");
		frame.Name = "Background";
		frame.Size = new UDim2(1, 0, 1, 0);
		frame.BackgroundColor3 = Color3.fromRGB(30, 30, 30);
		frame.BackgroundTransparency = 0.3;
		frame.BorderSizePixel = 0;
		frame.Parent = billboardGui;

		// Corner rounding
		const corner = new Instance("UICorner");
		corner.CornerRadius = new UDim(0, 8);
		corner.Parent = frame;

		// Padding
		const padding = new Instance("UIPadding");
		padding.PaddingTop = new UDim(0, 12);
		padding.PaddingBottom = new UDim(0, 12);
		padding.PaddingLeft = new UDim(0, 16);
		padding.PaddingRight = new UDim(0, 16);
		padding.Parent = frame;

		// Description text
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

		// Update banner color
		if (this.banner) {
			this.banner.Color = config.bannerColor;
		}

		// Update text labels
		for (const textLabel of this.textLabels) {
			textLabel.Text = config.name;
			textLabel.TextColor3 = config.color;
		}

		// Update description
		if (this.descriptionLabel) {
			this.descriptionLabel.Text = config.description;
			this.descriptionLabel.TextColor3 = config.color;
		}
	}

	protected onTriggered() {
		print("[Lobby] ModeBanner triggered");
		const state = this.lobbyController.getState();
		if (!state.room) {
			print("[Lobby] ModeBanner - no room, ignoring");
			return;
		}

		const nextMode = state.room.mode === MissionMode.Standard ? MissionMode.Ironman : MissionMode.Standard;
		print(`[Lobby] ModeBanner - toggling to mode: ${nextMode}`);
		this.lobbyController.setMissionMode(nextMode);
	}
}

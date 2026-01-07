import { Controller, OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";

@Controller({})
export class CameraController implements OnStart {
	onStart() {
		this.setupCamera();
	}

	private setupCamera() {
		const player = game.GetService("Players").LocalPlayer;
		if (!player) return;

		// Standard tactical camera settings
		player.CameraMaxZoomDistance = 40;
		player.CameraMinZoomDistance = 0.5; // Allows FPV
		player.CameraMode = Enum.CameraMode.Classic;
		
		const camera = Workspace.CurrentCamera;
		if (camera) {
			camera.FieldOfView = 70;
		}
	}
}

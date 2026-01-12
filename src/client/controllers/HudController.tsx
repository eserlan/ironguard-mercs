import { Controller, OnStart } from "@flamework/core";
import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { App } from "client/ui/apps/App";
import { updateAppHealth } from "client/ui/state/app-state";

@Controller({})
export class HudController implements OnStart {
	onStart() {
		const player = Players.LocalPlayer;
		const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

		const appUi = new Instance("ScreenGui");
		appUi.Name = "AppUI";
		appUi.ResetOnSpawn = false;
		appUi.IgnoreGuiInset = true;
		appUi.DisplayOrder = 10;
		appUi.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
		appUi.Parent = playerGui;

		const root = createRoot(appUi);

		root.render(
			<StrictMode>
				<App />
			</StrictMode>,
		);

		print("React App Mounted via HudController into AppUI");
	}

	public updateHealth(current: number) {
		updateAppHealth(current);
		print(`HudController: Health updated to ${current}`);
	}
}

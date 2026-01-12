import { Players, TweenService } from "@rbxts/services";

/**
 * Shows an alert notification to the player with a message.
 * The notification appears at the top of the screen with an animation and auto-dismisses after 4 seconds.
 * 
 * @param message - The message to display in the alert
 */
export function showAlertNotification(message: string): void {
	const playerGui = Players.LocalPlayer?.FindFirstChild("PlayerGui") as PlayerGui | undefined;
	if (!playerGui) return;

	// Remove any existing alert
	const existing = playerGui.FindFirstChild("LaunchAlertGui");
	if (existing) existing.Destroy();

	// Create a new ScreenGui for the alert
	const screenGui = new Instance("ScreenGui");
	screenGui.Name = "LaunchAlertGui";
	screenGui.ResetOnSpawn = false;
	screenGui.DisplayOrder = 999;
	screenGui.Parent = playerGui;

	// Create the alert frame
	const frame = new Instance("Frame");
	frame.Name = "AlertFrame";
	frame.Size = new UDim2(0, 500, 0, 80);
	frame.Position = new UDim2(0.5, -250, 0, 120);
	frame.BackgroundColor3 = Color3.fromRGB(180, 50, 50);
	frame.BorderSizePixel = 0;
	frame.Parent = screenGui;

	const corner = new Instance("UICorner");
	corner.CornerRadius = new UDim(0, 12);
	corner.Parent = frame;

	const stroke = new Instance("UIStroke");
	stroke.Color = Color3.fromRGB(255, 100, 100);
	stroke.Thickness = 3;
	stroke.Parent = frame;

	// Warning icon
	const icon = new Instance("TextLabel");
	icon.Name = "Icon";
	icon.Size = new UDim2(0, 60, 1, 0);
	icon.Position = new UDim2(0, 0, 0, 0);
	icon.BackgroundTransparency = 1;
	icon.Text = "⚠️";
	icon.TextSize = 36;
	icon.Font = Enum.Font.GothamBold;
	icon.TextColor3 = Color3.fromRGB(255, 255, 255);
	icon.Parent = frame;

	// Message text
	const label = new Instance("TextLabel");
	label.Name = "Message";
	label.Size = new UDim2(1, -70, 1, 0);
	label.Position = new UDim2(0, 60, 0, 0);
	label.BackgroundTransparency = 1;
	label.Text = message;
	label.TextSize = 22;
	label.Font = Enum.Font.GothamBold;
	label.TextColor3 = Color3.fromRGB(255, 255, 255);
	label.TextWrapped = true;
	label.TextXAlignment = Enum.TextXAlignment.Left;
	label.Parent = frame;

	// Animate in
	frame.BackgroundTransparency = 1;
	label.TextTransparency = 1;
	icon.TextTransparency = 1;

	const fadeIn = TweenService.Create(frame, new TweenInfo(0.2), { BackgroundTransparency: 0 });
	const textFadeIn = TweenService.Create(label, new TweenInfo(0.2), { TextTransparency: 0 });
	const iconFadeIn = TweenService.Create(icon, new TweenInfo(0.2), { TextTransparency: 0 });

	fadeIn.Play();
	textFadeIn.Play();
	iconFadeIn.Play();

	// Auto-remove after 4 seconds with fade out
	task.delay(3.5, () => {
		if (screenGui.Parent) {
			const fadeOut = TweenService.Create(frame, new TweenInfo(0.5), { BackgroundTransparency: 1 });
			const textFadeOut = TweenService.Create(label, new TweenInfo(0.5), { TextTransparency: 1 });
			const iconFadeOut = TweenService.Create(icon, new TweenInfo(0.5), { TextTransparency: 1 });

			fadeOut.Play();
			textFadeOut.Play();
			iconFadeOut.Play();

			fadeOut.Completed.Connect(() => {
				screenGui.Destroy();
			});
		}
	});
}

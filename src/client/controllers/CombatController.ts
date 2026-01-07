import { Controller, OnStart } from "@flamework/core";
import { ContextActionService, Workspace } from "@rbxts/services";
import { GlobalEvents } from "../../shared/net";

@Controller({})
export class CombatController implements OnStart {
	private lastDash = 0;
	private dashCooldown = 2.0;

	onStart() {
		ContextActionService.BindAction("Attack", (_, state) => this.handleAttack(state), true, Enum.UserInputType.MouseButton1);
		ContextActionService.BindAction("Dash", (_, state) => this.handleDash(state), true, Enum.KeyCode.Q);
	}

	private handleAttack(state: Enum.UserInputState) {
		if (state !== Enum.UserInputState.Begin) return;

		const camera = Workspace.CurrentCamera;
		if (!camera) return;

		const mousePos = game.GetService("UserInputService").GetMouseLocation();
		const ray = camera.ViewportPointToRay(mousePos.X, mousePos.Y);

		GlobalEvents.client.CombatIntent.fire({
			weaponId: "AssaultRifle",
			origin: ray.Origin,
			direction: ray.Direction,
			timestamp: os.clock()
		});
	}

	private handleDash(state: Enum.UserInputState) {
		if (state !== Enum.UserInputState.Begin) return;

		const now = os.clock();
		if (now - this.lastDash < this.dashCooldown) return;

		this.lastDash = now;
		// Visual feedback (local velocity)
		const char = game.GetService("Players").LocalPlayer.Character;
		const root = char?.FindFirstChild("HumanoidRootPart") as BasePart;
		if (root) {
			root.AssemblyLinearVelocity = root.CFrame.LookVector.Mul(100);
		}

		GlobalEvents.client.CombatIntent.fire({
			type: "Dash",
			timestamp: now
		});
	}
}
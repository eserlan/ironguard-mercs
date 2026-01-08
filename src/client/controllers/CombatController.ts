import { Controller, OnStart } from "@flamework/core";
import { ContextActionService, Workspace } from "@rbxts/services";
import { Events } from "../events";
import { getClock } from "shared/utils/time";

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

		Events.CombatIntent.fire({
			weaponId: "AssaultRifle",
			origin: { x: ray.Origin.X, y: ray.Origin.Y, z: ray.Origin.Z },
			direction: { x: ray.Direction.X, y: ray.Direction.Y, z: ray.Direction.Z },
			timestamp: getClock()
		});
	}

	private handleDash(state: Enum.UserInputState) {
		if (state !== Enum.UserInputState.Begin) return;

		const now = getClock();
		if (now - this.lastDash < this.dashCooldown) return;

		this.lastDash = now;
		// Visual feedback (local velocity)
		const char = game.GetService("Players").LocalPlayer.Character;
		const root = char?.FindFirstChild("HumanoidRootPart") as BasePart;
		if (root) {
			root.AssemblyLinearVelocity = root.CFrame.LookVector.mul(100);

			Events.CombatIntent.fire({
				weaponId: "Dash",
				origin: { x: root.Position.X, y: root.Position.Y, z: root.Position.Z },
				direction: { x: root.CFrame.LookVector.X, y: root.CFrame.LookVector.Y, z: root.CFrame.LookVector.Z },
				timestamp: now,
			});
		}
	}
}
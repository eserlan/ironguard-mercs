import { Controller, OnStart } from "@flamework/core";
import { ContextActionService, Workspace } from "@rbxts/services";
import { Events } from "../events";
import { VFXController } from "./VFXController";
import { getClock } from "shared/utils/time";
import { Log } from "shared/utils/log";

@Controller({})
export class CombatController implements OnStart {
	private lastHit = 0;
	private hitCooldown = 0.4; // Matches Weapons config for BasicHit
	private isBlocking = false;
	private chargeStartTime = 0;
	private readonly chargeThreshold = 0.35; // Seconds to trigger heavy attack

	constructor(private vfx: VFXController) { }

	onStart() {
		Log.info("CombatController started");
		ContextActionService.BindAction(
			"BasicHit",
			(_, state) => this.handleBasicHit(state),
			true,
			Enum.UserInputType.MouseButton1,
		);

		ContextActionService.BindAction(
			"BasicBlock",
			(_, state) => this.handleBasicBlock(state),
			true,
			Enum.KeyCode.LeftControl,
		);

		ContextActionService.BindAction("Dash", (_, state) => this.handleDash(state), true, Enum.KeyCode.Q);
	}

	private handleBasicHit(state: Enum.UserInputState) {
		const now = getClock();
		const char = game.GetService("Players").LocalPlayer.Character;

		if (state === Enum.UserInputState.Begin) {
			this.chargeStartTime = now;
			Log.info("Charge started");

			// Local prediction: Immediate feedback
			if (char) this.vfx.spawnChargeWindup(char);

			this.fireCombatIntent("ChargeStart", "Begin");
		} else if (state === Enum.UserInputState.End) {
			const holdDuration = now - this.chargeStartTime;

			// Do NOT cancel immediately. Let the intent fire. 
			// If successful, the swing animation will naturally overwrite the charge pose.
			// Add a safety timeout in case the intent is rejected or dropped.
			if (char) {
				task.delay(1.0, () => {
					// Verify we aren't swinging (simple check if maid exists for charge but not overwritten?)
					// Actually vfx.cancelChargeWindup is safe to call even if charge was already consumed.
					this.vfx.cancelChargeWindup(char);
				});
			}

			this.fireCombatIntent("ChargeEnd", "End"); // Signal charge release/cancel

			if (holdDuration >= this.chargeThreshold) {
				Log.info(`Heavy Hit triggered (held ${math.round(holdDuration * 100) / 100}s)`);
				this.fireCombatIntent("HeavyHit");
			} else {
				Log.info("Basic Hit triggered (tap)");
				this.fireCombatIntent("BasicHit");
			}
		}
	}

	private handleBasicBlock(state: Enum.UserInputState) {
		if (state === Enum.UserInputState.Begin) {
			this.isBlocking = true;
			this.fireCombatIntent("BasicBlock", "Begin");
			Log.info("Blocking started");
		} else if (state === Enum.UserInputState.End || state === Enum.UserInputState.Cancel) {
			if (this.isBlocking) {
				this.isBlocking = false;
				this.fireCombatIntent("BasicBlock", "End");
				Log.info("Blocking ended");
			}
		}
	}

	private fireCombatIntent(weaponId: string, action?: "Begin" | "End") {
		const camera = Workspace.CurrentCamera;
		if (!camera) {
			Log.warn("No camera found for fireCombatIntent");
			return;
		}

		const char = game.GetService("Players").LocalPlayer.Character;
		if (!char) return;

		Log.info(`Firing ${weaponId} intent (${action ?? "None"})`);
		const mousePos = game.GetService("UserInputService").GetMouseLocation();
		const ray = camera.ViewportPointToRay(mousePos.X, mousePos.Y);

		// Use character position as origin for melee to avoid camera distance issues
		const origin = (weaponId === "BasicHit") ? char.GetPivot().Position : ray.Origin;

		Events.CombatIntent.fire({
			weaponId: weaponId,
			origin: { x: origin.X, y: origin.Y, z: origin.Z },
			direction: { x: ray.Direction.X, y: ray.Direction.Y, z: ray.Direction.Z },
			timestamp: getClock(),
			action: action,
		});
	}

	public triggerAttack(weaponId: string) {
		// Simulate a tap (Begin -> Wait -> End)
		this.fireCombatIntent(weaponId, "Begin");
		task.delay(0.1, () => this.fireCombatIntent(weaponId, "End"));
	}

	private handleDash(state: Enum.UserInputState) {
		if (state !== Enum.UserInputState.Begin) return;

		const char = game.GetService("Players").LocalPlayer.Character;
		const root = char?.FindFirstChild("HumanoidRootPart") as BasePart;
		if (root) {
			root.AssemblyLinearVelocity = root.CFrame.LookVector.mul(100);
		}
	}
}
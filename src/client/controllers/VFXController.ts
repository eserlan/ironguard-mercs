import { Controller, OnStart } from "@flamework/core";
import { Workspace, TweenService, Players } from "@rbxts/services";
import { Events } from "client/events";
import { Log } from "shared/utils/log";
import { Maid } from "shared/utils/Maid";
import { Weapons, WeaponClassSpeeds, WeaponClass } from "shared/domain/combat/config";

@Controller({})
export class VFXController implements OnStart {
	private template: BillboardGui;

	constructor() {
		// Create a template for pooling/cloning
		const bill = new Instance("BillboardGui");
		bill.Size = new UDim2(0, 100, 0, 50);
		bill.AlwaysOnTop = true;

		const label = new Instance("TextLabel");
		label.Size = new UDim2(1, 0, 1, 0);
		label.BackgroundTransparency = 1;
		label.TextColor3 = new Color3(1, 1, 1);
		label.TextStrokeTransparency = 0;
		label.TextScaled = true;
		label.Parent = bill;

		this.template = bill;
	}

	onStart() {
		print("VFXController started");

		Events.AbilityActivated.connect((sourceId, abilityId) => {
			this.handleAbilityVFX(sourceId, abilityId);
		});

		Events.CombatOccurred.connect((event) => {
			// Debug Log
			Log.info(`[VFX] Damage Event: ${event.damage} (Crit: ${event.isCrit}) @ ${event.position}`);

			let pos: Vector3;

			if (event.position) {
				pos = new Vector3(event.position.x, event.position.y, event.position.z);
			} else {
				// Fallback: spawn in front of local player locally if no position from server
				// This ensures we at least SEE the number, even if it's not perfectly on the target
				const char = Players.LocalPlayer?.Character;
				const root = char?.FindFirstChild("HumanoidRootPart") as BasePart;
				if (root) {
					pos = root.Position.add(root.CFrame.LookVector.mul(3)).add(new Vector3(0, 2, 0));
				} else {
					pos = new Vector3(0, 5, 0);
				}
			}

			if (event.damage <= 0) {
				this.spawnDamageNumber(pos, "BLOCKED", false);
			} else {
				this.spawnDamageNumber(pos, event.damage, event.isCrit);
			}
		});
	}

	private handleAbilityVFX(sourceId: string, abilityId: string) {
		Log.info(`VFX: Received activation for ${abilityId} from ${sourceId}`);
		const player = Players.GetPlayerByUserId(tonumber(sourceId)!);
		const character = player?.Character;
		if (!character) return;

		const position = character.GetPivot().Position;

		if (abilityId === "BasicHit" || abilityId === "HeavyHit") {
			this.spawnMeleeSwing(character, abilityId);
			return;
		}

		if (abilityId === "ChargeStart") {
			this.spawnChargeWindup(character);
			return;
		}

		if (abilityId === "ChargeEnd") {
			this.cancelChargeWindup(character);
			return;
		}

		switch (abilityId) {
			case "sanctuary-step":
				this.spawnPillarOfLight(position);
				break;
			case "aegis-pulse":
				this.spawnShieldBurst(position);
				break;
			case "martyrs-promise":
				this.spawnGreatOath(position);
				break;
			case "cinder-step":
				this.spawnCinderDash(position);
				break;
			case "blaze-finisher":
				this.spawnBlazeFinisher(position);
				break;
		}
	}

	public spawnDamageNumber(position: Vector3, amount: number | string, isCrit: boolean) {
		const maid = new Maid();

		// Spawn slightly above the pivot/hit point to avoid clipping into body/floor
		const startPos = position.add(new Vector3(0, 3, 0));

		const part = new Instance("Part");
		part.Transparency = 1;
		part.CanCollide = false;
		part.Anchored = true;
		part.Position = startPos;
		part.Parent = Workspace;
		maid.GiveTask(part);

		const gui = this.template.Clone();
		// Ensure it renders on top of 3D geometry
		gui.AlwaysOnTop = true;

		const label = gui.FindFirstChildOfClass("TextLabel")!;

		if (typeIs(amount, "number")) {
			label.Text = tostring(math.floor(amount));
			if (isCrit) {
				label.TextColor3 = new Color3(1, 0, 0); // Red for crit
				label.TextSize = 32;
				// Pop effect for crit
				label.TextStrokeTransparency = 0.5;
			} else {
				label.TextColor3 = new Color3(1, 1, 1); // White for regular
			}
		} else {
			label.Text = amount;
			label.TextColor3 = new Color3(0.7, 0.7, 0.7); // Grey for status text
			label.TextSize = 24;
		}

		gui.Adornee = part;
		gui.Parent = part;

		// Animation: Float UP
		const duration = 0.8;
		const targetPos = startPos.add(new Vector3(0, 3 + math.random() * 2, 0));

		const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
		const tween = TweenService.Create(part, tweenInfo, { Position: targetPos });
		tween.Play();

		// Cleanup
		task.delay(duration, () => {
			maid.Destroy();
		});
	}

	public spawnPillarOfLight(position: Vector3) {
		print(`[VFX] Spawning Pillar of Light at ${position}`);
		if (!Workspace) return;

		const part = new Instance("Part");
		part.Shape = Enum.PartType.Cylinder;
		part.Size = new Vector3(20, 10, 10);
		part.CFrame = new CFrame(position).mul(CFrame.Angles(0, 0, math.rad(90)));
		part.Color = Color3.fromRGB(255, 255, 200);
		part.Transparency = 0.5;
		part.Anchored = true;
		part.CanCollide = false;
		part.Parent = Workspace;

		task.delay(1, () => part.Destroy());
	}

	public spawnShieldBurst(position: Vector3) {
		print(`[VFX] Spawning Shield Burst at ${position}`);
		if (!Workspace) return;

		const part = new Instance("Part");
		part.Shape = Enum.PartType.Ball;
		part.Size = new Vector3(15, 15, 15);
		part.Position = position;
		part.Color = Color3.fromRGB(100, 200, 255);
		part.Transparency = 0.7;
		part.Anchored = true;
		part.CanCollide = false;
		part.Parent = Workspace;

		task.delay(0.5, () => part.Destroy());
	}

	public spawnGreatOath(position: Vector3) {
		print(`[VFX] Spawning Great Oath at ${position}`);
		if (!Workspace) return;

		const part = new Instance("Part");
		part.Size = new Vector3(1, 10, 1);
		part.Position = position;
		part.Color = Color3.fromRGB(255, 215, 0); // Gold
		part.Anchored = true;
		part.CanCollide = false;
		part.Parent = Workspace;

		task.delay(2, () => part.Destroy());
	}

	public spawnCinderDash(position: Vector3) {
		print(`[VFX] Spawning Cinder Dash at ${position}`);
		if (!Workspace) return;

		const part = new Instance("Part");
		part.Size = new Vector3(4, 4, 4);
		part.Position = position;
		part.Color = Color3.fromRGB(50, 50, 50); // Dark grey/ash
		part.Material = Enum.Material.Neon;
		part.Anchored = true;
		part.CanCollide = false;
		part.Parent = Workspace;

		task.delay(0.5, () => part.Destroy());
	}

	public spawnBlazeFinisher(position: Vector3) {
		print(`[VFX] Spawning Blaze Finisher at ${position}`);
		if (!Workspace) return;

		const part = new Instance("Part");
		part.Shape = Enum.PartType.Ball;
		part.Size = new Vector3(10, 10, 10);
		part.Position = position;
		part.Color = Color3.fromRGB(255, 100, 0); // Bright orange/fire
		part.Material = Enum.Material.Neon;
		part.Transparency = 0.4;
		part.Anchored = true;
		part.CanCollide = false;
		part.Parent = Workspace;

		task.delay(0.8, () => part.Destroy());
	}

	public spawnMeleeSwing(character: Model, weaponId: string) {
		const maid = new Maid();
		const weapon = Weapons[weaponId];
		const weaponClass = weapon?.meleeProfile?.weaponClass ?? WeaponClass.Sword;
		const isHeavy = weaponId === "HeavyHit"; // Explicit check or derive from profile

		// Speed multiplier: Heavy attacks use base speed but modified by profile playbackSpeed
		// For now, let's just use weapon class speed, maybe 0.8x for heavy
		let speedMult = WeaponClassSpeeds[weaponClass];
		if (isHeavy) speedMult *= 0.7; // Even slower for charged hit

		// Pure procedural swing - animation assets are unreliable
		this.runProceduralSwing(character, maid, speedMult, isHeavy);

		// Cleanup after swing duration (scaled by speed)
		const totalDuration = (isHeavy ? 1.0 : 0.65) / speedMult;
		task.delay(totalDuration, () => maid.Destroy());
	}

	// Track active charge effects
	private activeCharges = new Map<Model, Maid>();

	// Cache base C0 for characters to ensure we always return to true neutral
	private basePoses = new WeakMap<Model, { shoulder: CFrame, waist?: CFrame }>();

	private getBasePose(character: Model): { shoulder: CFrame, waist?: CFrame } | undefined {
		if (this.basePoses.has(character)) {
			return this.basePoses.get(character);
		}

		const rightUpperArm = character.FindFirstChild("RightUpperArm");
		const rightShoulder = rightUpperArm?.FindFirstChild("RightShoulder") as Motor6D | undefined;
		const upperTorso = character.FindFirstChild("UpperTorso");
		const waist = upperTorso?.FindFirstChild("Waist") as Motor6D | undefined;

		if (rightShoulder) {
			const pose = { shoulder: rightShoulder.C0, waist: waist?.C0 };
			this.basePoses.set(character, pose);
			return pose;
		}
		return undefined;
	}

	public spawnChargeWindup(character: Model) {
		// If already charging (e.g. from local prediction), ignore duplicate requests
		if (this.activeCharges.has(character)) return;

		// Clean up existing charge if any (redundant now but safe)
		this.cancelChargeWindup(character);

		const maid = new Maid();
		this.activeCharges.set(character, maid);

		const rightUpperArm = character.FindFirstChild("RightUpperArm");
		const rightShoulder = rightUpperArm?.FindFirstChild("RightShoulder") as Motor6D | undefined;
		const basePose = this.getBasePose(character);

		if (rightShoulder && basePose) {
			const originalC0 = basePose.shoulder;
			// DO NOT add reset task to maid. We handle it explicitly in cancelChargeWindup to allow seamless transitions.

			// Enter charge pose (Matches Phase 1 Windup)
			// 110 deg pitch (High), -45 yaw (Out to Right), 0 roll
			const chargeC0 = originalC0.mul(CFrame.Angles(math.rad(110), math.rad(-45), math.rad(0)));

			// Use a fast windup speed for responsiveness
			TweenService.Create(rightShoulder, new TweenInfo(0.12, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { C0: chargeC0 }).Play();
		}
	}

	public cancelChargeWindup(character: Model, isTransitioning: boolean = false) {
		const maid = this.activeCharges.get(character);
		if (maid) {
			maid.Destroy();
			this.activeCharges.delete(character);
		}

		// If we are NOT transitioning to a slash, we must manually reset the arm to neutral
		if (!isTransitioning) {
			const rightUpperArm = character.FindFirstChild("RightUpperArm");
			const rightShoulder = rightUpperArm?.FindFirstChild("RightShoulder") as Motor6D | undefined;
			const basePose = this.getBasePose(character);

			if (rightShoulder && basePose) {
				TweenService.Create(rightShoulder, new TweenInfo(0.2), { C0: basePose.shoulder }).Play();
			}
		}
	}

	private runProceduralSwing(character: Model, maid: Maid, speedMult: number, isHeavy: boolean) {
		const rightUpperArm = character.FindFirstChild("RightUpperArm");
		const rightShoulder = rightUpperArm?.FindFirstChild("RightShoulder") as Motor6D | undefined;
		const upperTorso = character.FindFirstChild("UpperTorso");
		const waist = upperTorso?.FindFirstChild("Waist") as Motor6D | undefined;

		if (!rightShoulder) return;

		const basePose = this.getBasePose(character);
		if (!basePose) return;

		const originalShoulderC0 = basePose.shoulder;
		const originalWaistC0 = basePose.waist;

		// Check if we are already in a charged windup state
		const isAlreadyWindingUp = this.activeCharges.has(character);
		if (isAlreadyWindingUp) {
			// Stop holding the pose, but SKIP visual reset because we are about to slash immediately
			this.cancelChargeWindup(character, true);
		}

		// Register cleanup to reset positions when maid is destroyed
		maid.GiveTask(() => {
			rightShoulder.C0 = originalShoulderC0;
			if (waist && originalWaistC0) {
				waist.C0 = originalWaistC0;
			}
		});

		// Timing scaled by speed multiplier (higher = faster)
		const windupTime = 0.12 / speedMult;
		const slashTime = 0.15 / speedMult;
		const delayForSlash = isAlreadyWindingUp ? 0 : windupTime; // Skip windup wait if already there
		const recoverDelay = delayForSlash + slashTime + 0.05 / speedMult;
		const recoverTime = 0.3 / speedMult;

		// Phase 1: Windup (High Right Guard)
		// 110 deg pitch, -45 yaw (matches charge state)
		const windupShoulder = originalShoulderC0.mul(CFrame.Angles(math.rad(110), math.rad(-45), math.rad(0)));
		const windupWaist = originalWaistC0?.mul(CFrame.Angles(math.rad(-5), math.rad(-30), 0));

		if (!isAlreadyWindingUp) {
			const tweenWindup = TweenService.Create(rightShoulder, new TweenInfo(windupTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { C0: windupShoulder });
			tweenWindup.Play();
			if (waist && windupWaist) {
				TweenService.Create(waist, new TweenInfo(windupTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { C0: windupWaist }).Play();
			}
		}

		// Phase 2: Slash (Kesa-giri: Diagonal chop downwards to Left)
		task.delay(delayForSlash, () => {
			// 10 pitch = slight downward angle
			// 65 yaw = across body to Left
			// -45 roll = blade angle
			const slashShoulder = originalShoulderC0.mul(CFrame.Angles(math.rad(10), math.rad(65), math.rad(-45)));
			const slashWaist = originalWaistC0?.mul(CFrame.Angles(math.rad(10), math.rad(30), 0));

			const tweenSlash = TweenService.Create(rightShoulder, new TweenInfo(slashTime, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { C0: slashShoulder });
			tweenSlash.Play();
			if (waist && slashWaist) {
				TweenService.Create(waist, new TweenInfo(slashTime, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { C0: slashWaist }).Play();
			}

			this.spawnSlashEffect(character, speedMult);
		});

		// Phase 3: Recover (return to neutral)
		task.delay(recoverDelay, () => {
			const tweenRecover = TweenService.Create(rightShoulder, new TweenInfo(recoverTime, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { C0: originalShoulderC0 });
			tweenRecover.Play();
			if (waist && originalWaistC0) {
				TweenService.Create(waist, new TweenInfo(recoverTime, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { C0: originalWaistC0 }).Play();
			}
		});
	}





	private spawnSlashEffect(character: Model, speedMult: number) {
		const pivot = character.GetPivot();

		// Create arc trail effect (vertical slash)
		const arc = new Instance("Part");
		arc.Name = "SlashArc";
		arc.Size = new Vector3(3, 0.15, 4);
		arc.Color = Color3.fromRGB(255, 240, 220);
		arc.Transparency = 0.3;
		arc.Material = Enum.Material.Neon;
		arc.CanCollide = false;
		arc.Anchored = true;
		arc.CFrame = pivot.mul(new CFrame(0.5, 2.5, -1.5)).mul(CFrame.Angles(math.rad(-60), 0, math.rad(15)));
		arc.Parent = Workspace;

		// Animate arc sweep (vertical downward motion)
		const sweepTime = 0.2 / speedMult;
		const tweenInfo = new TweenInfo(sweepTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
		const endCFrame = pivot.mul(new CFrame(0.3, 0.5, -2.5)).mul(CFrame.Angles(math.rad(30), 0, math.rad(-10)));

		TweenService.Create(arc, tweenInfo, {
			CFrame: endCFrame,
			Transparency: 1,
			Size: new Vector3(4, 0.08, 5)
		}).Play();

		task.delay(sweepTime + 0.05, () => arc.Destroy());
	}


}

import { Controller, OnStart } from "@flamework/core";
import { Workspace, TweenService, Players } from "@rbxts/services";
import { Events } from "client/events";

type MaidTask = Instance | RBXScriptConnection | (() => void);

class Maid {
	private readonly tasks = new Array<MaidTask>();

	public GiveTask(task: MaidTask): void {
		this.tasks.push(task);
	}

	public Destroy(): void {
		for (const task of this.tasks) {
			if (typeIs(task, "RBXScriptConnection")) {
				task.Disconnect();
			} else if (typeIs(task, "Instance")) {
				task.Destroy();
			} else {
				task();
			}
		}
		this.tasks.clear();
	}
}

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
	}

	private handleAbilityVFX(sourceId: string, abilityId: string) {
		const player = Players.GetPlayerByUserId(tonumber(sourceId)!);
		const character = player?.Character;
		if (!character) return;

		const position = character.GetPivot().Position;

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
		}
	}

	public spawnDamageNumber(position: Vector3, amount: number, isCrit: boolean) {
		const maid = new Maid();

		const part = new Instance("Part");
		part.Transparency = 1;
		part.CanCollide = false;
		part.Anchored = true;
		part.Position = position;
		part.Parent = Workspace;
		maid.GiveTask(part);

		const gui = this.template.Clone();
		const label = gui.FindFirstChildOfClass("TextLabel")!;
		label.Text = tostring(math.floor(amount));

		if (isCrit) {
			label.TextColor3 = new Color3(1, 0, 0); // Red for crit
			label.TextSize = 32;
		}

		gui.Adornee = part;
		gui.Parent = part; // Or PlayerGui if we want 2D, but Billboard is 3D attached

		// Animation
		const duration = 1.0;
		const targetPos = position.add(new Vector3(0, 5, 0));

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
		// Visual only placeholder
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
		const part = new Instance("Part");
		part.Size = new Vector3(1, 10, 1);
		part.Position = position;
		part.Color = Color3.fromRGB(255, 215, 0); // Gold
		part.Anchored = true;
		part.CanCollide = false;
		part.Parent = Workspace;

		task.delay(2, () => part.Destroy());
	}
}
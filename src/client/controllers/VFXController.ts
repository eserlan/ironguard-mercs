import { Controller, OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Workspace, TweenService } from "@rbxts/services";

@Controller()
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
}

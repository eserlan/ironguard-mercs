import { Controller, OnStart } from "@flamework/core";
import { Lighting, Players } from "@rbxts/services";

@Controller()
export class AmbianceController implements OnStart {
	onStart() {
		this.applyAtmosphere();
		this.spawnDustMotes();
	}

	private applyAtmosphere() {
		// Ensure local overrides for atmosphere if the server ones aren't enough
		// This enforces the "Cold Fire" contrast
        const atmosphere = Lighting.FindFirstChildOfClass("Atmosphere");
        if (atmosphere) {
            atmosphere.Density = 0.45;
            atmosphere.Haze = 2;
            atmosphere.Color = Color3.fromRGB(38, 51, 64); // Dark blue-ish
            atmosphere.Decay = Color3.fromRGB(50, 40, 25); // Brownish decay
        }
	}

	private spawnDustMotes() {
		const player = Players.LocalPlayer;

        // We'll attach this to the HumanoidRootPart whenever it exists
        player.CharacterAdded.Connect((char) => {
            this.attachParticles(char);
        });

        if (player.Character) {
            this.attachParticles(player.Character);
        }
	}

    private attachParticles(character: Model) {
        const root = character.WaitForChild("HumanoidRootPart") as BasePart;

        // Check if we already added it
        if (root.FindFirstChild("AshMotes")) return;

        const emitter = new Instance("ParticleEmitter");
        emitter.Name = "AshMotes";
        emitter.Texture = "rbxassetid://1234567890"; // TODO: Replace with "ash" texture
        emitter.Color = new ColorSequence(new Color3(0.5, 0.5, 0.5));
        emitter.Size = new NumberSequence(0.1, 0.3);
        emitter.Transparency = new NumberSequence(0.5, 1);
        emitter.Lifetime = new NumberRange(5, 10);
        emitter.Rate = 20;
        emitter.Speed = new NumberRange(0.5, 2);
        emitter.SpreadAngle = new Vector2(180, 180);
        emitter.RotSpeed = new NumberRange(-50, 50);
        emitter.Rotation = new NumberRange(0, 360);
        emitter.Parent = root;
    }
}


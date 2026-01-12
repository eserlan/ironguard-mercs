import { Controller, OnStart } from "@flamework/core";
import { Players, UserInputService } from "@rbxts/services";

const WALK_SPEED = 16;
const RUN_SPEED = 28;

@Controller({})
export class MovementController implements OnStart {
	private isRunning = false;

	onStart() {
		// Listen for shift key press
		UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (gameProcessed) return;

			if (input.KeyCode === Enum.KeyCode.LeftShift || input.KeyCode === Enum.KeyCode.RightShift) {
				this.startRunning();
			}
		});

		// Listen for shift key release
		UserInputService.InputEnded.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.LeftShift || input.KeyCode === Enum.KeyCode.RightShift) {
				this.stopRunning();
			}
		});

		// Ensure speed is set correctly when character spawns
		Players.LocalPlayer.CharacterAdded.Connect((character) => {
			this.setupCharacter(character);
		});

		// Setup current character if it exists
		const character = Players.LocalPlayer.Character;
		if (character) {
			this.setupCharacter(character);
		}
	}

	private setupCharacter(character: Model) {
		const humanoid = character.WaitForChild("Humanoid") as Humanoid;
		humanoid.WalkSpeed = this.isRunning ? RUN_SPEED : WALK_SPEED;
	}

	private startRunning() {
		this.isRunning = true;
		this.updateSpeed();
	}

	private stopRunning() {
		this.isRunning = false;
		this.updateSpeed();
	}

	private updateSpeed() {
		const character = Players.LocalPlayer.Character;
		if (!character) return;

		const humanoid = character.FindFirstChild("Humanoid") as Humanoid | undefined;
		if (humanoid) {
			humanoid.WalkSpeed = this.isRunning ? RUN_SPEED : WALK_SPEED;
		}
	}

	public getIsRunning(): boolean {
		return this.isRunning;
	}
}


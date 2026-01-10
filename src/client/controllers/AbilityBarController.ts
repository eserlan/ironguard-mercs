import { Controller, OnStart } from "@flamework/core";
import { UserInputService, Players } from "@rbxts/services";
import { Log } from "../../shared/utils/log";
import { Events } from "../events";
import { AbilityIntent } from "../../shared/domain/abilities/types";
import { getClock } from "../../shared/utils/time";

interface EquippedSlot {
	slotIndex: number;
	abilityId: string;
}

@Controller({})
export class AbilityBarController implements OnStart {
	private loadout: EquippedSlot[] = [];
	private classId = "";
	private seq = 0;
	private slotCooldowns = new Map<number, { remaining: number; total: number }>();

	onStart() {
		Log.info("AbilityBarController started");

		// Listen for loadout confirmation from server
		Events.LoadoutConfirmed.connect((classId, slots) => {
			this.classId = classId;
			this.loadout = slots;
			Log.info(`Loadout confirmed: ${classId} with ${slots.size()} abilities`);
		});

		// Listen for cooldown updates from server
		Events.SlotCooldownState.connect((slotIndex, remaining, total) => {
			this.slotCooldowns.set(slotIndex, { remaining, total });
		});

		// Listen for ability activation broadcasts (VFX trigger point)
		Events.AbilityActivated.connect((sourceId, abilityId, slotIndex) => {
			Log.info(`Ability ${abilityId} activated by ${sourceId} on slot ${slotIndex}`);
		});

		// Input handling
		UserInputService.InputBegan.Connect((input, processed) => {
			if (processed) return;

			const slot = this.getSlotFromKey(input.KeyCode);
			if (slot !== undefined) {
				const isShift = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift);
				this.castAbility(slot, isShift ? "Top" : "Bottom");
			}
		});
	}

	private castAbility(slotIndex: number, action: "Top" | "Bottom") {
		// Check if we have an ability in this slot
		const equipped = this.loadout.find((s) => s.slotIndex === slotIndex);
		if (!equipped) {
			Log.info(`No ability equipped in slot ${slotIndex}`);
			return;
		}

		// Check local cooldown (optimistic rejection)
		const cd = this.slotCooldowns.get(slotIndex);
		if (cd && cd.remaining > 0) {
			Log.info(`Slot ${slotIndex} on cooldown (${cd.remaining}s remaining)`);
			return;
		}

		// Construct and send intent
		this.seq++;
		const intent: AbilityIntent = {
			slotIndex,
			action,
			seq: this.seq,
			timestamp: getClock(),
			payload: this.buildTargetingPayload(),
		};

		Log.info(`Sending ${action} intent for slot ${slotIndex} (${equipped.abilityId})`);
		Events.AbilityIntent.fire(intent);
	}

	private buildTargetingPayload(): AbilityIntent["payload"] {
		// For now, just include player's facing direction
		const player = Players.LocalPlayer;
		const character = player.Character;
		if (!character) return {};

		const root = character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
		if (!root) return {};

		const look = root.CFrame.LookVector;
		return {
			direction: { x: look.X, y: look.Y, z: look.Z },
		};
	}

	private getSlotFromKey(code: Enum.KeyCode): number | undefined {
		if (code === Enum.KeyCode.One) return 0;
		if (code === Enum.KeyCode.Two) return 1;
		if (code === Enum.KeyCode.Three) return 2;
		if (code === Enum.KeyCode.Four) return 3;
		return undefined;
	}

	/** Returns true if the given slot is currently on cooldown */
	public isOnCooldown(slotIndex: number): boolean {
		const cd = this.slotCooldowns.get(slotIndex);
		return cd !== undefined && cd.remaining > 0;
	}

	/** Get the current loadout for UI display */
	public getLoadout(): EquippedSlot[] {
		return this.loadout;
	}

	/** Get the current class ID */
	public getClassId(): string {
		return this.classId;
	}
}

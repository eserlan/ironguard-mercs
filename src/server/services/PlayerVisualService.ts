import { Service } from "@flamework/core";
import { InsertService, LogService } from "@rbxts/services";
import { Log } from "../../shared/utils/log";
import { Weapons } from "../../shared/domain/combat/config";

@Service({})
export class PlayerVisualService {
    public applyWeaponModel(player: Player, weaponId: string) {
        const character = player.Character;
        if (!character) return;

        const weaponConfig = Weapons[weaponId];
        if (!weaponConfig || !weaponConfig.assetId) return;

        // Clean up existing weapon models if any
        const hand = character.FindFirstChild("RightHand") || character.FindFirstChild("Right Arm");
        if (!hand) return;

        const existing = hand.FindFirstChild("WeaponModel");
        if (existing) existing.Destroy();

        try {
            // In a real Roblox environment, we would use InsertService or load from a folder
            // For this simulation, we'll create a placeholder if it fails or simulate the insert
            Log.info(`Loading asset ${weaponConfig.assetId} for ${player.Name}'s ${weaponId}`);

            // In production Luau, this would be: 
            // const model = InsertService.LoadAsset(weaponConfig.assetId).GetChildren()[0] as Model;

            const asset = InsertService.LoadAsset(weaponConfig.assetId);
            const tool = asset.FindFirstChildWhichIsA("Tool");

            if (tool) {
                tool.Name = "WeaponModel"; // Tag for cleanup
                tool.Parent = character;
                // Tools auto-weld to RightHand if valid.
                Log.info(`Loaded weapon tool ${weaponConfig.assetId} for ${player.Name}`);
            } else {
                // Fallback if asset isn't a Tool (e.g. Model)
                const model = asset.FindFirstChildWhichIsA("Model") || asset.FindFirstChildWhichIsA("BasePart");
                if (model) {
                    model.Name = "WeaponModel";
                    model.Parent = hand;

                    if (model.IsA("BasePart")) {
                        const weld = new Instance("WeldConstraint");
                        weld.Part0 = hand as BasePart;
                        weld.Part1 = model;
                        weld.Parent = model;
                        model.CFrame = (hand as BasePart).CFrame.mul(new CFrame(0, -1, -0.5));
                    }
                    Log.info(`Loaded weapon model ${weaponConfig.assetId} for ${player.Name}`);
                } else {
                    Log.warn(`Asset ${weaponConfig.assetId} contained no Tool or Model`);
                }
            }

        } catch (e) {
            Log.error(`Failed to load weapon asset ${weaponConfig.assetId}: ${e}`);
        }
    }
}

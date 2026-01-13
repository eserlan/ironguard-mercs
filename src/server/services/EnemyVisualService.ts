import { Service, OnStart } from "@flamework/core";
import { Log } from "shared/utils/log";
import { EnemyArchetype } from "shared/domain/enemies/config";
import { VisualProfiles } from "server/data/enemy-visual-profiles";
import { EnemyVisualProfile } from "shared/domain/enemies/visual-types";
import { ServerStorage } from "@rbxts/services";

@Service({})
export class EnemyVisualService implements OnStart {
    onStart() {
        Log.info("EnemyVisualService started");
    }

    /**
     * Sets up the visuals for a spawned enemy rig based on its archetype config.
     */
    public setupEnemyVisuals(rig: Model, archetype: EnemyArchetype) {
        const humanoid = rig.FindFirstChildOfClass("Humanoid");
        if (!humanoid) {
            Log.warn(`Rig ${rig.Name} has no Humanoid, skipping visual setup`);
            return;
        }

        const profile = VisualProfiles[archetype.visual.profileKey];
        if (!profile) {
            Log.warn(`No visual profile found for key: ${archetype.visual.profileKey}`);
            return;
        }

        Log.info(`Setting up visuals for ${rig.Name} using profile: ${archetype.visual.profileKey}`);
        this.applyVisualProfile(rig, profile);
        this.attachWeapon(rig, archetype.visual.weaponKey);
    }

    private applyVisualProfile(rig: Model, profile: EnemyVisualProfile) {
        // We directly manipulate the parts because HumanoidDescription (ApplyDescription)
        // is asynchronous and rebuilds the rig, breaking our manual WeldConstraints.

        for (const child of rig.GetChildren()) {
            if (child.IsA("BasePart")) {
                // 1. Apply Body Colors
                if (profile.bodyColors) {
                    const colors = profile.bodyColors;
                    if (child.Name === "Head" && colors.head) child.Color = colors.head;
                    else if (child.Name === "UpperTorso" && colors.torso) child.Color = colors.torso;
                    else if (child.Name === "LowerTorso" && colors.torso) child.Color = colors.torso;
                    else if (child.Name.find("Arm")[0] !== undefined) {
                        if (child.Name.find("Left")[0] !== undefined && colors.leftArm) child.Color = colors.leftArm;
                        else if (child.Name.find("Right")[0] !== undefined && colors.rightArm) child.Color = colors.rightArm;
                    } else if (child.Name.find("Leg")[0] !== undefined) {
                        if (child.Name.find("Left")[0] !== undefined && colors.leftLeg) child.Color = colors.leftLeg;
                        else if (child.Name.find("Right")[0] !== undefined && colors.rightLeg) child.Color = colors.rightLeg;
                    }
                }

                // 2. Apply Scaling
                if (profile.scale) {
                    const s = profile.scale;
                    const originalSize = child.Size;
                    const scaleVec = new Vector3(s.width ?? 1, s.height ?? 1, s.depth ?? 1);
                    child.Size = originalSize.mul(scaleVec);

                    // Note: In a real rig we'd need to adjust joint offsets (Motor6Ds),
                    // but since we are using WeldConstraints for these constructs,
                    // we just need to ensure the scaling happens BEFORE welding.
                }
            }
        }

        // 3. Apply Spooky Eyes (Neon Attachments)
        if (profile.eyeColor) {
            this.attachEyes(rig, profile.eyeColor);
        }

        Log.debug(`Applied construct visuals (scale: ${profile.scale ? "yes" : "no"}) to ${rig.Name}`);
    }

    private attachEyes(rig: Model, color: Color3) {
        const head = rig.FindFirstChild("Head") as BasePart;
        if (!head) return;

        // Create two eyes relative to the head
        const eyePositions = [
            new Vector3(0.2, 0.2, -0.6), // Right eye (relative to head center)
            new Vector3(-0.2, 0.2, -0.6), // Left eye
        ];

        for (const pos of eyePositions) {
            const eye = new Instance("Part");
            eye.Name = "SpookyEye";
            eye.Shape = Enum.PartType.Ball;
            eye.Size = new Vector3(0.15, 0.15, 0.15);
            eye.Color = color;
            eye.Material = Enum.Material.Neon;
            eye.CanCollide = false;
            eye.Massless = true;
            eye.Parent = rig;

            const weld = new Instance("WeldConstraint");
            weld.Part0 = head;
            weld.Part1 = eye;
            weld.Parent = eye;

            // Positioning: eyes are in front of the head
            // In Roblox R15, front is -Z
            eye.CFrame = head.CFrame.mul(new CFrame(pos));

            // Add a small light for extra spookiness
            const light = new Instance("PointLight");
            light.Color = color;
            light.Range = 4;
            light.Brightness = 2;
            light.Parent = eye;
        }
    }

    private attachWeapon(rig: Model, weaponKey?: string) {
        if (!weaponKey) return;

        const weaponsFolder = ServerStorage.FindFirstChild("Weapons");
        if (!weaponsFolder) {
            Log.warn("ServerStorage/Weapons folder not found");
            return;
        }

        const weaponModel = weaponsFolder.FindFirstChild(weaponKey) as Model;
        if (!weaponModel) {
            Log.warn(`Weapon model ${weaponKey} not found in ServerStorage/Weapons`);
            return;
        }

        const rightHand = rig.FindFirstChild("RightHand") as BasePart;
        if (!rightHand) {
            Log.warn(`Rig ${rig.Name} has no RightHand to attach weapon to`);
            return;
        }

        const clonedWeapon = weaponModel.Clone();
        clonedWeapon.Parent = rig;

        const handle = clonedWeapon.FindFirstChild("Handle") as BasePart;
        if (handle) {
            const weld = new Instance("WeldConstraint");
            weld.Part0 = rightHand;
            weld.Part1 = handle;
            weld.Parent = handle;

            // Basic alignment if handle exists
            handle.CFrame = rightHand.CFrame;
        } else {
            // If no handle, just parent it and hope for the best, or log error
            Log.warn(`Weapon model ${weaponKey} has no Handle part`);
        }

        Log.info(`Attached weapon ${weaponKey} to rig ${rig.Name}`);
    }
}

import { Service, OnStart } from "@flamework/core";
import { Log } from "shared/utils/log";
import { EnemyArchetype } from "shared/domain/enemies/config";
import { VisualProfiles } from "shared/domain/enemies/visual-profiles";
import { EnemyVisualProfile } from "shared/domain/enemies/visual-types";

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

        this.applyVisualProfile(humanoid, profile);
        this.attachWeapon(rig, archetype.visual.weaponKey);
    }

    private applyVisualProfile(humanoid: Humanoid, profile: EnemyVisualProfile) {
        const description = new Instance("HumanoidDescription");

        // 1. Accessories
        // The 'Accessories' property is a string of comma-separated asset IDs.
        (description as unknown as { Accessories: string }).Accessories = profile.assetIds.join(",");


        // 2. Clothing
        if (profile.shirtTemplateId) description.Shirt = profile.shirtTemplateId;
        if (profile.pantsTemplateId) description.Pants = profile.pantsTemplateId;

        // 3. Body Colors
        if (profile.bodyColors) {
            const colors = profile.bodyColors;
            if (colors.head) description.HeadColor = colors.head;
            if (colors.torso) description.TorsoColor = colors.torso;
            if (colors.leftArm) description.LeftArmColor = colors.leftArm;
            if (colors.rightArm) description.RightArmColor = colors.rightArm;
            if (colors.leftLeg) description.LeftLegColor = colors.leftLeg;
            if (colors.rightLeg) description.RightLegColor = colors.rightLeg;
        }

        // 4. Scaling
        if (profile.scale) {
            const s = profile.scale;
            if (s.height) description.HeightScale = s.height;
            if (s.width) description.WidthScale = s.width;
            if (s.depth) description.DepthScale = s.depth;
            if (s.head) description.HeadScale = s.head;
        }

        // Apply synchronously on server for predictability
        humanoid.ApplyDescription(description);
        Log.debug(`Applied visual profile to humanoid`);
    }

    private attachWeapon(rig: Model, weaponKey?: string) {
        if (!weaponKey) return;
        Log.info(`Attaching weapon ${weaponKey} to rig ${rig.Name} (Stub)`);
        // TODO: Implement weapon model spawning and welding to RightHand
    }
}

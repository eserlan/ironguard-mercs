
import { EnemyVisualProfile } from "./visual-types";

export const VisualProfiles: Record<string, EnemyVisualProfile> = {
    Slasher: {
        rigType: "R15",
        assetIds: [
            11750247076, // Mask
            14562080352, // Shoulder
        ],
        bodyColors: {
            torso: Color3.fromRGB(80, 40, 40),
            head: Color3.fromRGB(40, 40, 40),
        },
        scale: {
            height: 1.1,
        },
    },
    Guard: {
        rigType: "R15",
        assetIds: [
            11438258327, // Hood
        ],
        bodyColors: {
            torso: Color3.fromRGB(40, 60, 80),
        },
        scale: {
            width: 1.2,
        },
    },
};

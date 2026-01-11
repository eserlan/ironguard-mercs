

export interface EnemyVisualProfile {
    rigType: "R15";
    assetIds: number[];
    shirtTemplateId?: number;
    pantsTemplateId?: number;
    bodyColors?: {
        head?: Color3;
        torso?: Color3;
        leftArm?: Color3;
        rightArm?: Color3;
        leftLeg?: Color3;
        rightLeg?: Color3;
    };
    scale?: {
        height?: number;
        width?: number;
        depth?: number;
        head?: number;
    };
}

export interface EnemyVisualConfig {
    profileKey: string;
    weaponKey?: string;
    animationSetKey?: string;
}

import React from "@rbxts/react";
import { Weapons } from "shared/domain/combat/config";

import { Dependency } from "@flamework/core";
import { CombatController } from "client/controllers/CombatController";

export function WeaponStatus() {
    // Hardcoded for now based on current "Sword" default. 
    // Future: Subscribe to LoadoutService or Equipment changes.
    const weapon = Weapons.Sword;
    const combatController = React.useMemo(() => Dependency<CombatController>(), []);

    return (
        <frame
            Size={new UDim2(0, 80, 0, 140)}
            BackgroundTransparency={1}
        >
            <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 10)} VerticalAlignment="Bottom" />

            {/* Armor / Shield Placeholder */}
            <frame
                Size={new UDim2(1, 0, 0, 40)}
                BackgroundColor3={Color3.fromRGB(40, 40, 50)}
                BackgroundTransparency={0.2}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />
                <textlabel
                    Text="SHIELD"
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(150, 150, 150)}
                    Font={Enum.Font.GothamBold}
                    TextSize={10}
                />
            </frame>

            {/* Weapon Display - Interactive */}
            <textbutton
                Text=""
                AutoButtonColor={true}
                Size={new UDim2(1, 0, 0, 80)}
                BackgroundColor3={Color3.fromRGB(30, 30, 30)}
                BackgroundTransparency={0.2}
                Event={{
                    Activated: () => {
                        print("WeaponStatus clicked - Requesting Attack");
                        combatController.triggerAttack(weapon.id);
                    }
                }}
            >
                <uicorner CornerRadius={new UDim(0, 8)} />
                <uistroke Color={Color3.fromRGB(100, 100, 100)} Thickness={1} />

                {/* Icon */}
                {weapon.assetId !== undefined && (
                    <imagelabel
                        Image={`rbxthumb://type=Asset&id=${weapon.assetId}&w=420&h=420`}
                        Size={new UDim2(0, 64, 0, 64)}
                        Position={new UDim2(0.5, 0, 0.5, 0)}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundTransparency={1}
                    />
                )}

                <textlabel
                    Text="M1"
                    Size={new UDim2(1, -5, 1, -5)}
                    Position={new UDim2(1, -5, 1, -5)}
                    AnchorPoint={new Vector2(1, 1)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(200, 200, 200)}
                    Font={Enum.Font.GothamBlack}
                    TextSize={14}
                    TextXAlignment={Enum.TextXAlignment.Right}
                    TextYAlignment={Enum.TextYAlignment.Bottom}
                />
            </textbutton>
        </frame>
    );
}

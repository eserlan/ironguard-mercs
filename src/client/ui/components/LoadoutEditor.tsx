import React from "@rbxts/react";
import { STARTER_GEAR } from "shared/data/gear/starter";
import { EquipmentSlot, GearRarity } from "shared/domain/gear/types";

interface LoadoutEditorProps {
    loadout?: Record<string, string>;
    onEquip: (slot: EquipmentSlot, gearId: string) => void;
}

const RARITY_COLORS = {
    [GearRarity.Common]: Color3.fromRGB(180, 180, 180),
    [GearRarity.Uncommon]: Color3.fromRGB(50, 200, 50),
    [GearRarity.Rare]: Color3.fromRGB(50, 150, 255),
    [GearRarity.Exotic]: Color3.fromRGB(255, 100, 255),
};

export function LoadoutEditor({ loadout = {}, onEquip }: LoadoutEditorProps) {
    const slots = [
        EquipmentSlot.Weapon,
        EquipmentSlot.Offhand,
        EquipmentSlot.Armour,
        EquipmentSlot.Utility,
    ];

    return (
        <frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
            <uilistlayout
                Padding={new UDim(0, 20)}
                FillDirection="Horizontal"
                HorizontalAlignment="Center"
                VerticalAlignment="Center"
            />

            {slots.map((slot) => {
                const equippedId = loadout[slot];
                const equippedItem = STARTER_GEAR.find((g) => g.id === equippedId);
                const availableItems = STARTER_GEAR.filter((g) => g.slot === slot);

                return (
                    <frame key={slot} Size={new UDim2(0, 200, 0, 350)} BackgroundColor3={Color3.fromRGB(30, 30, 30)}>
                        <uicorner CornerRadius={new UDim(0, 12)} />
                        <uipadding PaddingTop={new UDim(0, 10)} PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 10)} PaddingBottom={new UDim(0, 10)} />

                        <textlabel
                            Text={slot.upper()}
                            Size={new UDim2(1, 0, 0, 30)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(150, 150, 150)}
                            TextSize={22}
                            Font={Enum.Font.GothamBold}
                        />

                        {/* Equipped Preview */}
                        <frame Size={new UDim2(1, 0, 0, 100)} Position={new UDim2(0, 0, 0, 40)} BackgroundColor3={Color3.fromRGB(40, 40, 40)}>
                            <uicorner CornerRadius={new UDim(0, 8)} />
                            <textlabel
                                Text={equippedItem?.name ?? "EMPTY"}
                                Size={new UDim2(1, 0, 1, 0)}
                                BackgroundTransparency={1}
                                TextColor3={equippedItem ? RARITY_COLORS[equippedItem.rarity] : Color3.fromRGB(80, 80, 80)}
                                TextSize={20}
                                Font={Enum.Font.GothamMedium}
                            />
                        </frame>

                        {/* Selection List */}
                        <scrollingframe
                            Size={new UDim2(1, 0, 1, -150)}
                            Position={new UDim2(0, 0, 0, 150)}
                            BackgroundTransparency={1}
                            ScrollBarThickness={4}
                            CanvasSize={new UDim2(0, 0, 0, availableItems.size() * 45)}
                        >
                            <uilistlayout Padding={new UDim(0, 5)} />
                            {availableItems.map((item) => (
                                <textbutton
                                    key={item.id}
                                    Text={item.name}
                                    Size={new UDim2(1, -10, 0, 40)}
                                    BackgroundColor3={equippedId === item.id ? Color3.fromRGB(50, 100, 50) : Color3.fromRGB(50, 50, 50)}
                                    TextColor3={RARITY_COLORS[item.rarity]}
                                    Font={Enum.Font.Gotham}
                                    TextSize={18}
                                    Event={{ Activated: () => onEquip(slot, item.id) }}
                                >
                                    <uicorner CornerRadius={new UDim(0, 6)} />
                                </textbutton>
                            ))}
                        </scrollingframe>
                    </frame>
                );
            })}
        </frame>
    );
}

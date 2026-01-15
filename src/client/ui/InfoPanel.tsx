import React from "@rbxts/react";

export interface InfoPanelData {
    name: string;
    description: string;
    technical: string;
    parentName: string;
}

export interface InfoPanelProps {
    data: InfoPanelData;
    onClose: () => void;
}

export function InfoPanel({ data, onClose }: InfoPanelProps) {
    return (
        <frame
            key="InfoPanel"
            Size={new UDim2(0, 340, 0, 260)}
            Position={new UDim2(0, 20, 1, -290)} // Absolute positioning: Bottom Left
            BackgroundColor3={Color3.fromRGB(25, 25, 30)}
            ZIndex={200}
            Visible={true}
            Active={true}
        >
            <uicorner CornerRadius={new UDim(0, 10)} />
            <uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={2} Color={Color3.fromRGB(200, 160, 40)} />

            <uipadding
                PaddingTop={new UDim(0, 15)}
                PaddingBottom={new UDim(0, 15)}
                PaddingLeft={new UDim(0, 20)}
                PaddingRight={new UDim(0, 20)}
            />

            {/* Close Button */}
            <textbutton
                key="CloseBtn"
                Text="[X]"
                Size={new UDim2(0, 32, 0, 32)}
                Position={new UDim2(1, -16, 0, -16)}
                BackgroundColor3={Color3.fromRGB(200, 50, 50)}
                TextColor3={Color3.fromRGB(240, 240, 240)}
                Font={Enum.Font.GothamBold}
                TextSize={20}
                ZIndex={210}
                Event={{ Activated: onClose }}
            >
                <uicorner CornerRadius={new UDim(1, 0)} />
                <uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={Color3.fromRGB(255, 255, 255)} />
            </textbutton>

            <uilistlayout
                FillDirection={Enum.FillDirection.Vertical}
                Padding={new UDim(0, 8)}
                SortOrder={Enum.SortOrder.LayoutOrder}
            />

            {/* Title */}
            <textlabel
                key="Title"
                LayoutOrder={1}
                Text={data.name.upper()}
                Size={new UDim2(1, 0, 0, 25)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(255, 215, 0)}
                Font={Enum.Font.GothamBlack}
                TextSize={20}
                TextXAlignment={Enum.TextXAlignment.Left}
                ZIndex={202}
            />

            {/* Parent Ability Context */}
            <textlabel
                key="ParentName"
                LayoutOrder={2}
                Text={"[" + data.parentName.upper() + "]"}
                Size={new UDim2(1, 0, 0, 14)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(150, 150, 160)}
                Font={Enum.Font.SourceSansItalic}
                TextSize={13}
                TextXAlignment={Enum.TextXAlignment.Left}
                ZIndex={202}
            />

            {/* Description */}
            <textlabel
                key="Desc"
                LayoutOrder={3}
                Text={data.description}
                Size={new UDim2(1, 0, 0, 90)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(220, 220, 220)}
                Font={Enum.Font.GothamMedium}
                TextSize={14}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Top}
                ZIndex={202}
            />

            {/* Technical Info */}
            <textlabel
                key="Tech"
                LayoutOrder={4}
                Text={data.technical}
                Size={new UDim2(1, 0, 0, 90)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(150, 200, 255)}
                Font={Enum.Font.GothamBold}
                TextSize={13}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Top}
                ZIndex={202}
            />
        </frame>
    );
}

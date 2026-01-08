import React from "@rbxts/react";
import { SHIELD_SAINT, ASHBLADE } from "shared/data/classes/starter";

const CLASSES = [SHIELD_SAINT, ASHBLADE];

interface MercenarySelectorProps {
	selectedId?: string;
	onSelect: (id: string) => void;
}

export function MercenarySelector({ selectedId, onSelect }: MercenarySelectorProps) {
	return (
		<frame Size={new UDim2(1, -320, 1, 0)} BackgroundTransparency={1}>
			<uigridlayout 
				CellSize={new UDim2(0, 180, 0, 240)} 
				CellPadding={new UDim2(0, 20, 0, 20)} 
				HorizontalAlignment="Center"
				VerticalAlignment="Center"
			/>
			{CLASSES.map((cls) => (
				<textbutton
					key={cls.id}
					Text=""
					Size={new UDim2(0, 0, 0, 0)}
					BackgroundColor3={selectedId === cls.id ? Color3.fromRGB(50, 200, 50) : Color3.fromRGB(60, 60, 60)}
					Event={{
						Activated: () => onSelect(cls.id),
					}}
				>
					<uicorner CornerRadius={new UDim(0, 12)} />
					<uipadding PaddingTop={new UDim(0, 10)} PaddingBottom={new UDim(0, 10)} PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 10)} />
					
					<textlabel
						Text={cls.name}
						Size={new UDim2(1, 0, 0, 30)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextSize={20}
						Font={Enum.Font.GothamBold}
					/>
					
					<textlabel
						Text={cls.role}
						Size={new UDim2(1, 0, 0, 20)}
						Position={new UDim2(0, 0, 0, 35)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(200, 200, 200)}
						TextSize={14}
						Font={Enum.Font.Gotham}
					/>
					
					<textlabel
						Text={`HP: ${cls.baseStats.hp}\nDEF: ${cls.baseStats.defense}`}
						Size={new UDim2(1, 0, 0, 60)}
						Position={new UDim2(0, 0, 1, -60)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(180, 180, 180)}
						TextSize={14}
						Font={Enum.Font.Gotham}
					/>
				</textbutton>
			))
		}</frame>
	);
}
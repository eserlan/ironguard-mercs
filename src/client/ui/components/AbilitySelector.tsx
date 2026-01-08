import React, { useState } from "@rbxts/react";
import { AbilityRegistry } from "shared/domain/abilities/config";
import { AbilityConfig } from "shared/domain/abilities/types";
import { ClassRegistry } from "shared/domain/classes/config";

interface AbilitySelectorProps {
	classId: string;
	onConfirm: (loadout: { slotIndex: number; abilityId: string }[]) => void;
}

export function AbilitySelector({ classId, onConfirm }: AbilitySelectorProps) {
	const classConfig = ClassRegistry.get(classId);
	const [selectedAbilities, setSelectedAbilities] = useState<string[]>([]);

	if (!classConfig) return <textlabel Text="Class not found" Size={new UDim2(1, 0, 1, 0)} />;

	const availableAbilities: AbilityConfig[] = [];
	for (const id of classConfig.abilityLibrary) {
		const ability = AbilityRegistry.get(id);
		if (ability) {
			availableAbilities.push(ability);
		}
	}

	const toggleAbility = (id: string) => {
		setSelectedAbilities((prev) => {
			if (prev.includes(id)) {
				return prev.filter((a) => a !== id);
			}
			if (prev.size() >= 4) return prev;
			return [...prev, id];
		});
	};

	const handleConfirm = () => {
		const loadout = selectedAbilities.map((id, index) => ({
			slotIndex: index + 1,
			abilityId: id,
		}));
		onConfirm(loadout);
	};

	return (
		<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
			<uipadding PaddingTop={new UDim(0, 20)} PaddingBottom={new UDim(0, 20)} PaddingLeft={new UDim(0, 20)} PaddingRight={new UDim(0, 20)} />
			
			<textlabel
				Text={`SELECT ABILITIES (${selectedAbilities.size()}/4)`}
				Size={new UDim2(1, 0, 0, 40)}
				BackgroundTransparency={1}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={24}
				Font={Enum.Font.GothamBold}
			/>

			<scrollingframe
				Size={new UDim2(1, 0, 1, -100)}
				Position={new UDim2(0, 0, 0, 50)}
				BackgroundTransparency={1}
				ScrollBarThickness={4}
			>
				<uigridlayout 
					CellSize={new UDim2(0, 200, 0, 120)} 
					CellPadding={new UDim2(0, 10, 0, 10)} 
				/>
				{availableAbilities.map((ability) => (
					<textbutton
						key={ability.id}
						Text=""
						BackgroundColor3={selectedAbilities.includes(ability.id) ? Color3.fromRGB(50, 150, 50) : Color3.fromRGB(40, 40, 40)}
						Event={{ Activated: () => toggleAbility(ability.id) }}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />
						<uipadding PaddingTop={new UDim(0, 10)} PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 10)} PaddingBottom={new UDim(0, 10)} />
						
						<textlabel
							Text={ability.name}
							Size={new UDim2(1, 0, 0, 20)}
							BackgroundTransparency={1}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							TextSize={18}
						/>
						
						<textlabel
							Text={`TOP: ${ability.variants.top.cooldown}s | BOT: ${ability.variants.bottom.cooldown}s`}
							Size={new UDim2(1, 0, 0, 40)}
							Position={new UDim2(0, 0, 0, 25)}
							BackgroundTransparency={1}
							TextColor3={Color3.fromRGB(200, 200, 200)}
							Font={Enum.Font.Gotham}
							TextSize={14}
							TextWrapped={true}
						/>
					</textbutton>
				))}
			</scrollingframe>

			<textbutton
				Text="CONFIRM LOADOUT"
				Size={new UDim2(0, 200, 0, 40)}
				Position={new UDim2(0.5, -100, 1, -40)}
				BackgroundColor3={selectedAbilities.size() > 0 ? Color3.fromRGB(0, 180, 0) : Color3.fromRGB(80, 80, 80)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={Enum.Font.GothamBold}
				Event={{ Activated: () => selectedAbilities.size() > 0 && handleConfirm() }}
			>
				<uicorner CornerRadius={new UDim(0, 8)} />
			</textbutton>
		</frame>
	);
}
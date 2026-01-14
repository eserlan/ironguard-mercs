import React from "@rbxts/react";
import { AbilityRegistry } from "shared/domain/abilities/config";
import { AbilityConfig } from "shared/domain/abilities/types";
import { ClassRegistry } from "shared/domain/classes/config";
import { Log } from "shared/utils/log";

interface AbilitySelectorProps {
	classId: string;
	initialLoadout?: { slotIndex: number; abilityId: string }[];
	onConfirm: (loadout: { slotIndex: number; abilityId: string }[]) => void;
}

export function AbilitySelector({ classId, initialLoadout, onConfirm }: AbilitySelectorProps) {
	const classConfig = ClassRegistry.get(classId);

	// Pre-populate from initialLoadout if provided
	const defaultAbilities = (initialLoadout ?? []).map((s) => s.abilityId);
	const [selectedAbilities, setSelectedAbilities] = React.useState<string[]>(defaultAbilities);

	const [hoveredAbilityId, setHoveredAbilityId] = React.useState<string | undefined>();
	const hoveredAbility = hoveredAbilityId ? AbilityRegistry.get(hoveredAbilityId) : undefined;

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
			slotIndex: index,
			abilityId: id,
		}));
		Log.info(`[AbilitySelector] Confirming loadout with ${loadout.size()} abilities: ${selectedAbilities.join(", ")}`);
		onConfirm(loadout);
	};

	return (
		<frame
			Size={new UDim2(0, 850, 0, 550)}
			Position={new UDim2(0.5, -425, 0.5, -275)}
			BackgroundColor3={Color3.fromRGB(20, 20, 25)}
			BorderSizePixel={0}
		>
			<uicorner CornerRadius={new UDim(0, 12)} />
			<uipadding PaddingTop={new UDim(0, 25)} PaddingBottom={new UDim(0, 25)} PaddingLeft={new UDim(0, 25)} PaddingRight={new UDim(0, 25)} />

			{/* Left Side: Grid */}
			<frame Size={new UDim2(0, 500, 1, 0)} BackgroundTransparency={1}>
				<textlabel
					Text={`PLEDGE ABILITIES (${selectedAbilities.size()}/4)`}
					Size={new UDim2(1, 0, 0, 40)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextSize={28}
					Font={Enum.Font.GothamBlack}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>

				<scrollingframe
					Size={new UDim2(1, 0, 1, -120)}
					Position={new UDim2(0, 0, 0, 50)}
					BackgroundTransparency={1}
					ScrollBarThickness={4}
					CanvasSize={new UDim2(0, 0, 0, math.ceil(availableAbilities.size() / 3) * 110)}
				>
					<uigridlayout
						CellSize={new UDim2(0, 150, 0, 100)}
						CellPadding={new UDim2(0, 15, 0, 15)}
					/>
					{availableAbilities.map((ability) => (
						<textbutton
							key={ability.id}
							Text=""
							BackgroundColor3={selectedAbilities.includes(ability.id) ? Color3.fromRGB(45, 120, 45) : Color3.fromRGB(45, 45, 50)}
							Event={{
								Activated: () => toggleAbility(ability.id),
								MouseEnter: () => setHoveredAbilityId(ability.id),
								MouseLeave: () => setHoveredAbilityId(undefined)
							}}
						>
							<uicorner CornerRadius={new UDim(0, 8)} />
							<uipadding PaddingTop={new UDim(0, 10)} PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 10)} PaddingBottom={new UDim(0, 10)} />

							<textlabel
								Text={ability.name.upper()}
								Size={new UDim2(1, 0, 1, 0)}
								BackgroundTransparency={1}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								Font={Enum.Font.GothamBold}
								TextSize={16}
								TextWrapped={true}
							/>
						</textbutton>
					))}
				</scrollingframe>

				<textbutton
					Text="CONFIRM PLEDGE"
					Size={new UDim2(0, 300, 0, 50)}
					Position={new UDim2(0, 0, 1, -50)}
					BackgroundColor3={selectedAbilities.size() > 0 ? Color3.fromRGB(34, 139, 34) : Color3.fromRGB(60, 60, 65)}
					TextColor3={selectedAbilities.size() > 0 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(150, 150, 150)}
					Font={Enum.Font.GothamBold}
					TextSize={20}
					AutoButtonColor={selectedAbilities.size() > 0}
					Event={{ Activated: () => selectedAbilities.size() > 0 && handleConfirm() }}
				>
					<uicorner CornerRadius={new UDim(0, 8)} />
				</textbutton>
			</frame>

			{/* Right Side: Detail Panel */}
			<frame
				Size={new UDim2(0, 275, 1, 0)}
				Position={new UDim2(1, -275, 0, 0)}
				BackgroundColor3={Color3.fromRGB(30, 30, 35)}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(0, 10)} />
				<uipadding PaddingTop={new UDim(0, 20)} PaddingLeft={new UDim(0, 20)} PaddingRight={new UDim(0, 20)} PaddingBottom={new UDim(0, 20)} />

				{hoveredAbility ? (
					<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
						<textlabel
							Text={hoveredAbility.name.upper()}
							Size={new UDim2(1, 0, 0, 25)}
							BackgroundTransparency={1}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={Enum.Font.GothamBold}
							TextSize={22}
							TextXAlignment={Enum.TextXAlignment.Left}
						/>
						<textlabel
							Text={hoveredAbility.description || ""}
							Size={new UDim2(1, 0, 0, 60)}
							Position={new UDim2(0, 0, 0, 30)}
							BackgroundTransparency={1}
							TextColor3={Color3.fromRGB(180, 180, 180)}
							Font={Enum.Font.GothamMedium}
							TextSize={14}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Top}
							TextWrapped={true}
						/>

						{/* Top Variant */}
						<frame Size={new UDim2(1, 0, 0, 120)} Position={new UDim2(0, 0, 0, 100)} BackgroundTransparency={1}>
							<textlabel
								Text={hoveredAbility.variants.top.name?.upper() || "TOP ACTION"}
								Size={new UDim2(1, 0, 0, 20)}
								BackgroundTransparency={1}
								TextColor3={Color3.fromRGB(255, 180, 100)}
								Font={Enum.Font.GothamBold}
								TextSize={15}
								TextXAlignment={Enum.TextXAlignment.Left}
							/>
							<textlabel
								Text={hoveredAbility.variants.top.technical || ""}
								Size={new UDim2(1, 0, 1, -25)}
								Position={new UDim2(0, 0, 0, 25)}
								BackgroundTransparency={1}
								TextColor3={Color3.fromRGB(220, 220, 220)}
								Font={Enum.Font.GothamMedium}
								TextSize={14}
								TextXAlignment={Enum.TextXAlignment.Left}
								TextYAlignment={Enum.TextYAlignment.Top}
								TextWrapped={true}
							/>
							<textlabel
								Text={`${hoveredAbility.variants.top.cooldown}s CD`}
								Size={new UDim2(1, 0, 0, 15)}
								Position={new UDim2(0, 0, 1, -15)}
								BackgroundTransparency={1}
								TextColor3={Color3.fromRGB(120, 120, 120)}
								Font={Enum.Font.GothamMedium}
								TextSize={12}
								TextXAlignment={Enum.TextXAlignment.Right}
							/>
						</frame>

						{/* Bottom Variant */}
						<frame Size={new UDim2(1, 0, 0, 120)} Position={new UDim2(0, 0, 0, 230)} BackgroundTransparency={1}>
							<textlabel
								Text={hoveredAbility.variants.bottom.name?.upper() || "BOTTOM ACTION"}
								Size={new UDim2(1, 0, 0, 20)}
								BackgroundTransparency={1}
								TextColor3={Color3.fromRGB(100, 180, 255)}
								Font={Enum.Font.GothamBold}
								TextSize={15}
								TextXAlignment={Enum.TextXAlignment.Left}
							/>
							<textlabel
								Text={hoveredAbility.variants.bottom.technical || ""}
								Size={new UDim2(1, 0, 1, -25)}
								Position={new UDim2(0, 0, 0, 25)}
								BackgroundTransparency={1}
								TextColor3={Color3.fromRGB(220, 220, 220)}
								Font={Enum.Font.GothamMedium}
								TextSize={14}
								TextXAlignment={Enum.TextXAlignment.Left}
								TextYAlignment={Enum.TextYAlignment.Top}
								TextWrapped={true}
							/>
							<textlabel
								Text={`${hoveredAbility.variants.bottom.cooldown}s CD`}
								Size={new UDim2(1, 0, 0, 15)}
								Position={new UDim2(0, 0, 1, -15)}
								BackgroundTransparency={1}
								TextColor3={Color3.fromRGB(120, 120, 120)}
								Font={Enum.Font.GothamMedium}
								TextSize={12}
								TextXAlignment={Enum.TextXAlignment.Right}
							/>
						</frame>
					</frame>
				) : (
					<textlabel
						Text="CONSULT THE TOME FOR DETAILS"
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(80, 80, 85)}
						Font={Enum.Font.GothamMedium}
						TextSize={18}
						TextWrapped={true}
					/>
				)}
			</frame>
		</frame>
	);
}
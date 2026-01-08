import React from "@rbxts/react";
import { AbilityRegistry } from "shared/domain/abilities/config";
import { useAbilityCooldowns } from "./hooks/useAbilityCooldowns";

interface AbilityBarProps {
	loadout: { slotIndex: number; abilityId: string }[];
}

export function AbilityBar({ loadout }: AbilityBarProps) {
	const cooldowns = useAbilityCooldowns();

	return (
		<frame
			Size={new UDim2(0, 400, 0, 100)}
			Position={new UDim2(0.5, -200, 1, -120)}
			BackgroundTransparency={1}
		>
			<uilistlayout
				FillDirection="Horizontal"
				Padding={new UDim(0, 10)}
				HorizontalAlignment="Center"
			/>

			{[1, 2, 3, 4].map((slotIndex) => {
				const entry = loadout.find((l) => l.slotIndex === slotIndex);
				const ability = entry ? AbilityRegistry.get(entry.abilityId) : undefined;
				const cooldown = cooldowns.get(slotIndex);

				const isCooldown = cooldown !== undefined && cooldown.remaining > 0;
				const fillScale = cooldown ? cooldown.remaining / cooldown.total : 0;

				return (
					<frame
						key={slotIndex}
						Size={new UDim2(0, 80, 0, 80)}
						BackgroundColor3={ability ? Color3.fromRGB(50, 50, 50) : Color3.fromRGB(30, 30, 30)}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />
						<uistroke Thickness={2} Color={ability ? Color3.fromRGB(100, 100, 100) : Color3.fromRGB(50, 50, 50)} />

						{ability && (
							<React.Fragment>
								<textlabel
									Text={ability.name}
									Size={new UDim2(1, 0, 0.4, 0)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextSize={12}
									Font={Enum.Font.GothamBold}
									TextWrapped={true}
								/>
								
								{/* Keybind hints */}
								<textlabel
									Text="[LMB] Top"
									Size={new UDim2(1, 0, 0.3, 0)}
									Position={new UDim2(0, 0, 0.4, 0)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(200, 200, 200)}
									TextSize={10}
									Font={Enum.Font.Gotham}
								/>
								<textlabel
									Text="[RMB] Bot"
									Size={new UDim2(1, 0, 0.3, 0)}
									Position={new UDim2(0, 0, 0.7, 0)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(200, 200, 200)}
									TextSize={10}
									Font={Enum.Font.Gotham}
								/>

								{/* Cooldown Overlay */}
								{isCooldown && (
									<frame
										Size={new UDim2(1, 0, fillScale, 0)}
										Position={new UDim2(0, 0, 1 - fillScale, 0)}
										BackgroundColor3={Color3.fromRGB(255, 0, 0)}
										BackgroundTransparency={0.7}
										ZIndex={2}
									>
										<uicorner CornerRadius={new UDim(0, 8)} />
									</frame>
								)}
								{isCooldown && (
									<textlabel
										Text={string.format("%.1f", cooldown!.remaining)}
										Size={new UDim2(1, 0, 1, 0)}
										BackgroundTransparency={1}
										TextColor3={Color3.fromRGB(255, 255, 255)}
										TextSize={20}
										Font={Enum.Font.GothamBold}
										ZIndex={3}
									/>
								)}
							</React.Fragment>
						)}
						
						{!ability && (
							<textlabel
								Text="EMPTY"
								Size={new UDim2(1, 0, 1, 0)}
								BackgroundTransparency={1}
								TextColor3={Color3.fromRGB(60, 60, 60)}
								TextSize={14}
								Font={Enum.Font.Gotham}
							/>
						)}
					</frame>
				);
			})}
		</frame>
	);
}
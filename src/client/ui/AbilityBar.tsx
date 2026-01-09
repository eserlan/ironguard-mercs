import React, { useEffect, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { AbilityRegistry } from "shared/domain/abilities/config";
import { useAbilityCooldowns } from "./hooks/useAbilityCooldowns";
import type { AbilityController } from "client/controllers/AbilityController";

interface AbilityBarProps {
	loadout: { slotIndex: number; abilityId: string }[];
	controller: AbilityController;
}

interface AbilityColumnProps {
	slotIndex: number;
	abilityId?: string;
	expiry?: number;
	total?: number;
	keyCode: string;
	controller: AbilityController;
}

function AbilityColumn({ slotIndex, abilityId, expiry, total, keyCode, controller }: AbilityColumnProps) {
	const ability = abilityId ? AbilityRegistry.get(abilityId) : undefined;
	const [remaining, setRemaining] = useState(0);

	useEffect(() => {
		if (!expiry || expiry <= os.clock()) {
			setRemaining(0);
			return;
		}
		setRemaining(expiry - os.clock());
		const conn = RunService.Heartbeat.Connect(() => {
			const left = math.max(0, expiry - os.clock());
			setRemaining(left);
			if (left <= 0) conn.Disconnect();
		});
		return () => conn.Disconnect();
	}, [expiry]);

	const fillScale = total && total > 0 ? remaining / total : 0;
	const isCooldown = remaining > 0;

	// Helper component for a button within the column
	const AbilityButton = (props: {
		variant: "Top" | "Bottom";
		label: string;
		height: UDim;
		color: Color3;
	}) => {
		const variantData = props.variant === "Top" ? ability?.variants.top : ability?.variants.bottom;

		return (
			<textbutton
				Text=""
				Size={new UDim2(new UDim(1, 0), props.height)}
				BackgroundColor3={ability ? props.color : Color3.fromRGB(30, 30, 30)}
				AutoButtonColor={!!ability}
				Event={{ Activated: () => ability && controller.requestCast(slotIndex, props.variant) }}
			>
				<uicorner CornerRadius={new UDim(0, 4)} />
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Thickness={1}
					Color={ability ? Color3.fromRGB(120, 120, 120) : Color3.fromRGB(60, 60, 60)}
				/>

				{/* Always show Label */}
				<textlabel
					Text={props.label}
					Size={new UDim2(0, 30, 0, 15)}
					Position={new UDim2(1, -35, 1, -20)}
					BackgroundTransparency={1}
					TextColor3={ability ? Color3.fromRGB(200, 200, 200) : Color3.fromRGB(80, 80, 80)}
					TextSize={14}
					Font={Enum.Font.GothamBlack}
					TextXAlignment={Enum.TextXAlignment.Right}
				/>

				{ability ? (
					/* Variant Name */
					<textlabel
						Text={variantData?.name?.upper() ?? props.variant}
						Size={new UDim2(1, -10, 0.4, 0)}
						Position={new UDim2(0, 5, 0, 5)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextSize={props.variant === "Top" ? 11 : 12}
						Font={Enum.Font.GothamBold}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
					/>
				) : (
					// Empty State
					<textlabel
						Text="EMPTY"
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(50, 50, 50)}
						TextSize={10}
						Font={Enum.Font.GothamBold}
					/>
				)}
			</textbutton>
		);
	};

	return (
		<frame Size={new UDim2(0, 70, 0, 140)} BackgroundTransparency={1}>
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 0)} SortOrder="LayoutOrder" />

			{/* Top Button (Shift) */}
			<frame Size={new UDim2(1, 0, 0.5, 0)} BackgroundTransparency={1} LayoutOrder={1}>
				<AbilityButton
					variant="Top"
					label={`S+${keyCode}`}
					height={new UDim(1, 0)}
					color={Color3.fromRGB(60, 50, 40)}
				/>
			</frame>

			{/* Bottom Button (Normal) */}
			<frame Size={new UDim2(1, 0, 0.5, 0)} BackgroundTransparency={1} LayoutOrder={2}>
				<AbilityButton
					variant="Bottom"
					label={keyCode}
					height={new UDim(1, 0)}
					color={Color3.fromRGB(50, 50, 60)}
				/>
				{/* Cooldown Overlay */}
				{isCooldown && (
					<frame
						Size={new UDim2(1, 0, fillScale, 0)}
						Position={new UDim2(0, 0, 1 - fillScale, 0)}
						BackgroundColor3={Color3.fromRGB(255, 50, 50)}
						BackgroundTransparency={0.6}
						ZIndex={5}
					>
						<uicorner CornerRadius={new UDim(0, 6)} />
					</frame>
				)}
				{isCooldown && (
					<textlabel
						Text={string.format("%.1f", remaining)}
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextSize={22}
						Font={Enum.Font.GothamBold}
						ZIndex={6}
						TextStrokeTransparency={0.5}
					/>
				)}
			</frame>
		</frame>
	);
}

export function AbilityBar({ loadout, controller }: AbilityBarProps) {
	const cooldowns = useAbilityCooldowns();
	const keyLabels = ["1", "2", "3", "4"];

	return (
		<frame
			Size={new UDim2(0, 280, 0, 140)}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={new UDim2(0.5, 0, 1, -2)}
			BackgroundTransparency={1}
		>
			<uilistlayout
				FillDirection="Horizontal"
				Padding={new UDim(0, 0)}
				HorizontalAlignment="Center"
				VerticalAlignment="Bottom"
			/>

			{[0, 1, 2, 3].map((slotIndex) => {
				const entry = loadout.find((l) => l.slotIndex === slotIndex);
				const cooldown = cooldowns.get(slotIndex);

				return (
					<AbilityColumn
						key={slotIndex}
						slotIndex={slotIndex}
						abilityId={entry?.abilityId}
						expiry={cooldown?.expiry}
						total={cooldown?.total}
						keyCode={keyLabels[slotIndex]}
						controller={controller}
					/>
				);
			})}
		</frame>
	);
}
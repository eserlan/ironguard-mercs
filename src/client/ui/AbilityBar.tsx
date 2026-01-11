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
	onHover: (variant: "Top" | "Bottom" | undefined) => void;
}

// Move outside to avoid unmounting on every render
const AbilityButton = (props: {
	variant: "Top" | "Bottom";
	label: string;
	height: UDim;
	color: Color3;
	ability?: ReturnType<typeof AbilityRegistry.get>;
	slotIndex: number;
	controller: AbilityController;
	onHover: (variant: "Top" | "Bottom" | undefined) => void;
}) => {
	const variantData = props.variant === "Top" ? props.ability?.variants.top : props.ability?.variants.bottom;

	return (
		<textbutton
			Text=""
			Size={new UDim2(new UDim(1, 0), props.height)}
			BackgroundColor3={props.ability ? props.color : Color3.fromRGB(30, 30, 30)}
			AutoButtonColor={!!props.ability}
			Event={{
				Activated: () => props.ability && props.controller.requestCast(props.slotIndex, props.variant),
				MouseEnter: () => {
					print("[AbilityBar] Hover Enter: " + (props.ability?.name ?? "None") + " (" + props.variant + ")");
					props.onHover(props.variant);
				},
				MouseLeave: () => {
					print(`[AbilityBar] Hover Leave: ${props.ability?.name ?? "None"}`);
					props.onHover(undefined);
				},
			}}
		>
			<uicorner CornerRadius={new UDim(0, 4)} />
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Thickness={1}
				Color={props.ability ? Color3.fromRGB(120, 120, 120) : Color3.fromRGB(60, 60, 60)}
			/>

			{/* Key Label */}
			<textlabel
				Text={props.label}
				Size={new UDim2(0, 30, 0, 15)}
				Position={new UDim2(1, -35, 1, -20)}
				BackgroundTransparency={1}
				TextColor3={props.ability ? Color3.fromRGB(200, 200, 200) : Color3.fromRGB(80, 80, 80)}
				TextSize={14}
				Font={Enum.Font.GothamBlack}
				TextXAlignment={Enum.TextXAlignment.Right}
				Active={false}
			/>

			{props.ability ? (
				<frame key="VariantNameFrame" Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1} Active={false}>
					{/* Variant Name */}
					<textlabel
						Text={string.upper(variantData?.name ?? props.variant)}
						Size={new UDim2(1, -10, 0.4, 0)}
						Position={new UDim2(0, 5, 0, 5)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextSize={props.variant === "Top" ? 11 : 12}
						Font={Enum.Font.GothamBold}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
						Active={false}
					/>
				</frame>
			) : (
				<textlabel
					Text="EMPTY"
					Size={new UDim2(1, 0, 1, 0)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(50, 50, 50)}
					TextSize={10}
					Font={Enum.Font.GothamBold}
					Active={false}
				/>
			)}
		</textbutton>
	);
};

function AbilityColumn({ slotIndex, abilityId, expiry, total, keyCode, controller, onHover }: AbilityColumnProps) {
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

	return (
		<frame Size={new UDim2(0, 70, 0, 140)} BackgroundTransparency={1} ZIndex={2}>
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 0)} SortOrder="LayoutOrder" />

			{/* Top Button (Shift) */}
			<frame Size={new UDim2(1, 0, 0.5, 0)} BackgroundTransparency={1} LayoutOrder={1}>
				<AbilityButton
					variant="Top"
					label={"S+" + keyCode}
					height={new UDim(1, 0)}
					color={Color3.fromRGB(60, 50, 40)}
					ability={ability}
					slotIndex={slotIndex}
					controller={controller}
					onHover={onHover}
				/>
			</frame>

			{/* Bottom Button (Normal) */}
			<frame Size={new UDim2(1, 0, 0.5, 0)} BackgroundTransparency={1} LayoutOrder={2}>
				<AbilityButton
					variant="Bottom"
					label={keyCode}
					height={new UDim(1, 0)}
					color={Color3.fromRGB(50, 50, 60)}
					ability={ability}
					slotIndex={slotIndex}
					controller={controller}
					onHover={onHover}
				/>
			</frame>

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
	);
}

export function AbilityBar({ loadout, controller }: AbilityBarProps) {
	const cooldowns = useAbilityCooldowns();
	const keyLabels = ["1", "2", "3", "4"];

	useEffect(() => {
	}, []);

	useEffect(() => {
	}, [loadout]);

	// hoveredInfo is only for the "pending" state or logic
	const [pendingHover, setPendingHover] = useState<
		{ startTime: number; data: { name: string; description: string; technical: string; parentName: string } } | undefined
	>(undefined);
	// activeInfo is the "sticky" information currently shown
	const [activeInfo, setActiveInfo] = useState<
		{ name: string; description: string; technical: string; parentName: string } | undefined
	>(undefined);

	useEffect(() => {
		const conn = RunService.Heartbeat.Connect(() => {
			if (pendingHover && os.clock() - pendingHover.startTime >= 0.5) {
				print("[AbilityBar] Activating Info: " + pendingHover.data.name);
				setActiveInfo(pendingHover.data);
				setPendingHover(undefined);
			}
		});
		return () => conn.Disconnect();
	}, [pendingHover]);

	const closePanel = () => {
		print("[AbilityBar] Closing Info Panel");
		setActiveInfo(undefined);
	};

	return (
		<frame
			Size={new UDim2(1, 0, 0, 140)}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={new UDim2(0.5, 0, 1, -2)}
			BackgroundTransparency={1}
			ZIndex={1}
		>
			{/* Info Panel (Bottom Left) - Sticky / Persistent */}
			{activeInfo && (
				<frame
					key="InfoPanel"
					Size={new UDim2(0, 320, 0, 240)}
					Position={new UDim2(0, 20, 0, -250)}
					BackgroundColor3={Color3.fromRGB(30, 30, 35)}
					ZIndex={200}
					Visible={true}
					Active={true}
				>
					<uicorner CornerRadius={new UDim(0, 12)} />
					<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={3} Color={Color3.fromRGB(200, 160, 40)} />

					<uipadding
						PaddingTop={new UDim(0, 15)}
						PaddingBottom={new UDim(0, 15)}
						PaddingLeft={new UDim(0, 15)}
						PaddingRight={new UDim(0, 15)}
					/>

					<uilistlayout
						FillDirection="Vertical"
						Padding={new UDim(0, 8)}
						SortOrder="LayoutOrder"
					/>

					{/* Close Button - Keep absolute */}
					<textbutton
						key="CloseBtn"
						Text="X"
						Size={new UDim2(0, 24, 0, 24)}
						Position={new UDim2(1, 10, 0, -10)}
						AnchorPoint={new Vector2(1, 0)}
						BackgroundColor3={Color3.fromRGB(200, 50, 50)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={Enum.Font.GothamBold}
						TextSize={18}
						ZIndex={210}
						Event={{ Activated: closePanel }}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
						<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={Color3.fromRGB(255, 255, 255)} />
					</textbutton>

					{/* Title */}
					<textlabel
						key="Title"
						LayoutOrder={1}
						Text={string.upper(activeInfo.name)}
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
						Text={string.upper(activeInfo.parentName)}
						Size={new UDim2(1, 0, 0, 15)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(150, 150, 160)}
						Font={Enum.Font.SourceSansItalic}
						TextSize={12}
						TextXAlignment={Enum.TextXAlignment.Left}
						ZIndex={202}
					/>

					{/* Description */}
					<textlabel
						key="Desc"
						LayoutOrder={3}
						Text={activeInfo.description}
						Size={new UDim2(1, 0, 0, 60)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(230, 230, 230)}
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
						Text={activeInfo.technical}
						Size={new UDim2(1, 0, 0, 80)}
						BackgroundTransparency={1}
						TextColor3={Color3.fromRGB(160, 200, 255)}
						Font={Enum.Font.GothamBold}
						TextSize={13}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Bottom}
						ZIndex={202}
					/>

					{(() => {
						print("[AbilityBar] Rendering InfoPanel: Name=" + activeInfo.name + ", DescLen=" + activeInfo.description.size());
						return undefined;
					})()}
				</frame>
			)}

			{/* Ability Columns Container (Centered) */}
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
				<uilistlayout
					FillDirection="Horizontal"
					Padding={new UDim(0, 0)}
					HorizontalAlignment="Center"
					VerticalAlignment="Bottom"
				/>

				{[0, 1, 2, 3].map((slotIndex) => {
					let entry: (typeof loadout)[number] | undefined = undefined;
					for (const l of loadout) {
						if (l.slotIndex === slotIndex) {
							entry = l;
							break;
						}
					}

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
							onHover={(variant) => {
								if (!variant || !entry?.abilityId) {
									if (pendingHover) {
										setPendingHover(undefined);
									}
									return;
								}
								const ability = AbilityRegistry.get(entry.abilityId);
								if (!ability) {
									return;
								}

								const data = variant === "Top" ? ability.variants.top : ability.variants.bottom;
								if (data) {
									if (pendingHover?.data.name === data.name) return;

									const info = {
										name: data.name ?? "Unknown",
										description: data.description ?? "",
										technical: data.technical ?? "",
										parentName: ability.name ?? "Core Ability",
									};
									setPendingHover({ startTime: os.clock(), data: info });
								}
							}}
						/>
					);
				})}
			</frame>
		</frame>
	);
}

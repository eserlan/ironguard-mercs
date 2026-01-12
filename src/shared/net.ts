import { Networking } from "@flamework/networking";
import { MatchState } from "./domain/run";
import { AbilityIntent } from "./domain/abilities/types";
import { CombatIntent, CombatEvent } from "./domain/combat/types";
import { PartyRoom } from "./domain/party/party-types";

interface ClientToServerEvents {
	RequestStartRun(seed?: number): void;
	CombatIntent(intent: CombatIntent): void;
	SelectClass(classId: string): void;
	SetLoadout(loadout: { slotIndex: number; abilityId: string }[]): void;
	AbilityIntent(intent: AbilityIntent): void;
	EquipItem(slot: string, gearId: string): void;
	CreateParty(): void;
	JoinParty(code: string): void;
	LeaveParty(): void;
	SelectMercenary(mercId: string): void;
	SetReady(ready: boolean): void;
	SetMissionMode(mode: string): void;
	SetDifficulty(difficulty: number): void;
	StepOnPad(): void;
	StepOffPad(): void;
	LaunchMission(): void;
}

interface ServerToClientEvents {
	RunStateChanged(state: MatchState): void;
	CombatOccurred(event: CombatEvent): void;
	Results(data: unknown): void;
	LoadoutConfirmed(classId: string, slots: { slotIndex: number; abilityId: string }[]): void;
	LoadoutRejected(reason: string): void;
	SlotCooldownState(slotIndex: number, remaining: number, total: number): void;
	GearEffectTriggered(gearId: string, effectType: string): void;
	AbilityActivated(sourceId: string, abilityId: string, slotIndex: number): void;
	PartyCreated(code: string): void;
	PartyJoined(roomState: PartyRoom): void;
	PartyUpdated(roomState: PartyRoom): void;
	PartyLeft(): void;
	MissionLaunching(seed: number): void;
	UnlockedClassesUpdated(classIds: string[]): void;
	/**
	 * Notifies the client about a mission launch-related alert.
	 *
	 * Fired when the server needs to inform clients about important mission launch status or issues,
	 * such as countdown messages, readiness checks, or validation errors.
	 *
	 * @param message A human-readable description of the launch alert.
	 */
	LaunchAlert(message: string): void;
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<object, object>();
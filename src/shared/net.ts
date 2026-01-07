import { Networking } from "@flamework/networking";
import { MatchState } from "./domain/run";
import { AbilityIntent } from "./domain/abilities/types";
import { CombatIntent, CombatEvent } from "./domain/combat/types";

interface ClientToServerEvents {
	RequestStartRun(seed?: number): void;
	CombatIntent(intent: CombatIntent): void;
	SelectClass(classId: string): void;
	SetLoadout(loadout: { slotIndex: number; abilityId: string }[]): void;
	AbilityIntent(intent: AbilityIntent): void;
	EquipItem(slot: string, gearId: string): void;
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
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<object, object>();
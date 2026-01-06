import { Networking } from "@flamework/networking";
import { MatchState } from "./domain/types";
import { AbilityIntent } from "./domain/abilities/types";

interface ClientToServerEvents {
	RequestStartRun(seed?: number): void;
	SelectClass(classId: string): void;
	SetLoadout(loadout: { slotIndex: number; abilityId: string }[]): void;
	AbilityIntent(intent: AbilityIntent): void;
}

interface ServerToClientEvents {
	RunStateChanged(state: MatchState): void;
	Results(data: unknown): void;
	LoadoutConfirmed(classId: string, slots: { slotIndex: number; abilityId: string }[]): void;
	LoadoutRejected(reason: string): void;
	SlotCooldownState(slotIndex: number, remaining: number, total: number): void;
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<{}, {}>();
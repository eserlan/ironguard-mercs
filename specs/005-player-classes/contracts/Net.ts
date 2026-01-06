// specs/005-player-classes/contracts/Net.ts
// Extends the global networking contract

interface ClientToServerEvents {
    SelectClass(classId: string): void;
    SetLoadout(loadout: { slotIndex: number, abilityId: string }[]): void;
    // Overrides/Extends 003
    AbilityIntent(slotIndex: number, action: "Top" | "Bottom", targetingPayload: unknown): void;
}

interface ServerToClientEvents {
    LoadoutConfirmed(classId: string, slots: { slotIndex: number, abilityId: string }[]): void;
    LoadoutRejected(reason: string): void;
    // Syncs shared cooldown per slot
    SlotCooldownState(slotIndex: number, remaining: number, total: number): void;
}

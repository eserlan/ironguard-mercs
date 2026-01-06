// specs/007-progression-levelup/contracts/Net.ts
// Extends the global networking contract

interface ServerToClientEvents {
    // XP & Level Updates
    TeamXPUpdate(current: number, total: number, level: number): void;
    
    // Level Up Choice Event
    LevelUpChoiceStarted(choices: { perkId: string, rarity: string }[], timeout: number): void;
    
    // Syncs active perks for HUD
    ActivePerksUpdate(perks: { id: string, stacks: number }[]): void;
}

interface ClientToServerEvents {
    // Player reward selection
    SelectPerk(perkId: string): void;
}

// specs/006-monster-concept/contracts/Net.ts
// Extends the global networking contract

interface ServerToClientEvents {
    // Authoritative telegraph sync
    TelegraphStarted(enemyId: string, moveId: string, duration: number, payload: unknown): void;
    TelegraphCancelled(enemyId: string): void;
    
    // Stagger/Break feedback
    EnemyStaggered(enemyId: string, duration: number): void;
    EnemyBreakMeterUpdate(enemyId: string, percent: number): void;
    
    // AI Debugging (Toggleable)
    AIDebugState(enemyId: string, targetId: string, scoreMap: Record<string, number>): void;
}

interface ClientToServerEvents {
    // Optional: client reports specific "intent to interrupt" for early prediction
}

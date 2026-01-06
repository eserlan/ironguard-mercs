// src/shared/net.ts
import { Networking } from "@flamework/networking";

// Client -> Server Events
interface ClientToServerEvents {
    RequestMatchStart(seed?: number): void;
    PlayerAction(actionId: string, targetId?: string): void;
}

// Server -> Client Events
interface ServerToClientEvents {
    MatchStateChanged(phase: string, timestamp: number): void;
    DungeonGenerated(layoutSummary: string): void; // Optimization: Send seeds/summary, not full graph?
    EntityUpdate(entityId: string, state: unknown): void;
}

// Define the Network Global
export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<{}, {}>();

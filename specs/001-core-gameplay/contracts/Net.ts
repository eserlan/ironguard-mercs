/**
 * @protocol RunStateSync
 * @description Defines how the server synchronizes the mission lifecycle with clients.
 */

import { MatchState, RunConfig } from "../../../shared/domain/run";

interface ServerToClientEvents {
    /**
     * Broadcast when any property of the MatchState changes (Phase, Time, Wave, etc.)
     */
    RunStateChanged: (state: MatchState) => void;
}

interface ClientToServerEvents {
    /**
     * Fired by the lobby leader to initiate a mission instance.
     */
    RequestStartRun: (seed?: number) => void;
}

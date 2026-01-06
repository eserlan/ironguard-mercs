import { StatusEffect } from "../../domain/combat/status";

export interface ActiveStatus {
    config: StatusEffect;
    startTime: number;
    nextTick?: number;
}

export function simulateStatus(current: ActiveStatus, now: number): { expired: boolean, tick: boolean } {
    const expired = now >= current.startTime + current.config.duration;
    let tick = false;
    if (current.config.tickInterval && current.nextTick && now >= current.nextTick) {
        tick = true;
        current.nextTick += current.config.tickInterval;
    }
    return { expired, tick };
}

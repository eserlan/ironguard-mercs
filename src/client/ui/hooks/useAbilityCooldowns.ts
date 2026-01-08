import { useState, useEffect } from "@rbxts/react";
import { Events } from "client/events";

export function useAbilityCooldowns() {
	const [cooldowns, setCooldowns] = useState<Map<number, { remaining: number; total: number }>>(new Map());

	useEffect(() => {
		const conn = Events.SlotCooldownState.connect((slotIndex, remaining, total) => {
			setCooldowns((prev) => {
				const nextCooldowns = new Map<number, { remaining: number; total: number }>();
				prev.forEach((val, key) => nextCooldowns.set(key, val));
				nextCooldowns.set(slotIndex, { remaining, total });
				return nextCooldowns;
			});
		});
		return () => conn.Disconnect();
	}, []);

	return cooldowns;
}
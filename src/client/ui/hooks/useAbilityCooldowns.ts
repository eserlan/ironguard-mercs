import { useState, useEffect } from "@rbxts/react";
import { Events } from "client/events";

export function useAbilityCooldowns() {
	const [cooldowns, setCooldowns] = useState<Map<number, { expiry: number; total: number }>>(new Map());

	useEffect(() => {
		const conn = Events.SlotCooldownState.connect((slotIndex, remaining, total) => {
			setCooldowns((prev) => {
				const nextCooldowns = new Map<number, { expiry: number; total: number }>();
				prev.forEach((val, key) => nextCooldowns.set(key, val));
				nextCooldowns.set(slotIndex, { expiry: os.clock() + remaining, total });
				return nextCooldowns;
			});
		});
		return () => conn.Disconnect();
	}, []);

	return cooldowns;
}
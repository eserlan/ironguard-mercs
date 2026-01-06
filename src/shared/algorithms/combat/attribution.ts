export function recordDamage(history: Record<string, number>, attackerId: string, amount: number) {
    history[attackerId] = (history[attackerId] || 0) + amount;
}

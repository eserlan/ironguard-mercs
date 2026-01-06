export function logTelemetry(event: string) {
	print(`[TELEMETRY] ${event}`);
}

export function logEnemyDeath(enemyId: string, sourceId: string, runId: string) {
	logTelemetry(`EnemyDeath:${enemyId} by ${sourceId} in ${runId}`);
}

export function logInterrupt(enemyId: string, abilityId: string, success: boolean) {
	logTelemetry(`Interrupt:${enemyId} with ${abilityId} success:${success}`);
}

export function logPerkChoice(userId: number, perkId: string, isTimeout: boolean) {
	logTelemetry(`PerkChoice:${perkId} by ${userId} timeout:${isTimeout}`);
}

export function logSlowTrigger(userId: number) {
	logTelemetry(`SlowTrigger by ${userId}`);
}

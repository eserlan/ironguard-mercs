import { AbilityConfig } from "./types";

export class AbilityRegistry {
	private static abilities = new Map<string, AbilityConfig>();

	public static register(config: AbilityConfig) {
		if (this.abilities.has(config.id)) {
			throw `Duplicate ability ID: ${config.id}`;
		}
		this.abilities.set(config.id, config);
	}

	public static get(id: string): AbilityConfig | undefined {
		return this.abilities.get(id);
	}

	public static validate(config: AbilityConfig): boolean {
		if (!config.id || !config.name) return false;
		if (config.cooldown < 0) return false;
		return true;
	}
}

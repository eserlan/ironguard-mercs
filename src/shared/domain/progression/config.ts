import { RunPerk } from "./types";

export class PerkRegistry {
	private static perks = new Map<string, RunPerk>();

	public static register(perk: RunPerk) {
		if (this.perks.has(perk.id)) {
			throw `Duplicate Perk ID: ${perk.id}`;
		}
		this.perks.set(perk.id, perk);
	}

	public static get(id: string): RunPerk | undefined {
		return this.perks.get(id);
	}

	public static getAll(): RunPerk[] {
		const list: RunPerk[] = [];
		this.perks.forEach((p) => list.push(p));
		return list;
	}

	public static validate(perk: RunPerk): boolean {
		if (!perk.id || !perk.name) return false;
		if (perk.effects.length === 0) return false;
		return true;
	}
}

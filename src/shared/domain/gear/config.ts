import { GearItem } from "./types";

export class GearRegistry {
	private static gear = new Map<string, GearItem>();

	public static register(item: GearItem) {
		if (this.gear.has(item.id)) {
			throw `Duplicate Gear ID: ${item.id}`;
		}
		this.gear.set(item.id, item);
	}

	public static get(id: string): GearItem | undefined {
		return this.gear.get(id);
	}

	public static getAll(): GearItem[] {
		const list: GearItem[] = [];
		this.gear.forEach((item) => list.push(item));
		return list;
	}

	public static validate(item: GearItem): boolean {
		if (!item.id || !item.name) return false;
		if (item.effects.size() === 0) return false;
		return true;
	}
}

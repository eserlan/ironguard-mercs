import { ClassConfig } from "./types";

export class ClassRegistry {
	private static classes = new Map<string, ClassConfig>();

	public static register(config: ClassConfig) {
		if (this.classes.has(config.id)) {
			throw `Duplicate class ID: ${config.id}`;
		}
		this.classes.set(config.id, config);
	}

	public static get(id: string): ClassConfig | undefined {
		return this.classes.get(id);
	}

	public static getAll(): ClassConfig[] {
		const list: ClassConfig[] = [];
		this.classes.forEach((c) => list.push(c));
		return list;
	}

	public static validate(config: ClassConfig): boolean {
		if (!config.id || !config.name) return false;
		if (config.abilityLibrary.size() === 0) return false;
		return true;
	}
}

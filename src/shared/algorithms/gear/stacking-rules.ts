export interface Modifier {
	type: "multiplier" | "additive";
	value: number;
}

export function aggregateModifiers(modifiers: Modifier[]): number {
	let totalMult = 1;
	let totalAdd = 0;

	for (const mod of modifiers) {
		if (mod.type === "multiplier") {
			totalMult *= mod.value;
		} else {
			totalAdd += mod.value;
		}
	}

	return (totalMult - 1) + totalAdd;
}

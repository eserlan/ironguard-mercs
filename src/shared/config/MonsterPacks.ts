import { MonsterPackDef } from "../types/SpawningTypes";

export const IronVanguardPack: MonsterPackDef = {
	id: "iron_vanguard_01",
	budgetCost: 20,
	minSize: 3,
	biomeTags: ["Forest", "Dungeon"],
	members: [
		{ enemyId: "iron-giant", role: "Elite", count: { Min: 1, Max: 1 } },
		{ enemyId: "iron-grunt", role: "Minion", count: { Min: 3, Max: 5 } }
	]
};

export const AllPacks: MonsterPackDef[] = [IronVanguardPack];

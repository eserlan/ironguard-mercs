import { MonsterPackDef } from "../types/SpawningTypes";

export const ForestWolfPack: MonsterPackDef = {
	id: "forest_wolves_01",
	budgetCost: 15,
	minSize: 3,
	biomeTags: ["Forest"],
	members: [
		{ enemyId: "Wolf_Alpha", role: "Elite", count: { Min: 1, Max: 1 } },
		{ enemyId: "Wolf_Pup", role: "Minion", count: { Min: 2, Max: 4 } }
	]
};

export const AllPacks: MonsterPackDef[] = [ForestWolfPack];

import { Service } from "@flamework/core";

@Service({})
export class DifficultyBudgetService {
	public calculateBudget(roomIndex: number): number {
		return 100 + roomIndex * 20;
	}
}

import { Service } from "@flamework/core";

@Service({})
export class DataService {
	public load(_player: Player) {
		return {};
	}

	public save(_player: Player) {
	}
}

import { Service, OnStart } from "@flamework/core";
import { ClassRegistry } from "../../shared/domain/classes/config";
import { Log } from "../../shared/utils/log";

@Service({})
export class ClassService implements OnStart {
	onStart() {
		Log.info("ClassService started");
	}

	public getClass(id: string) {
		return ClassRegistry.get(id);
	}

	public isClassUnlocked(userId: number, classId: string): boolean {
		// Real impl: check PlayerProfile
		return true;
	}
}

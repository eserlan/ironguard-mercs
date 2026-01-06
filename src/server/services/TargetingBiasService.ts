import { Service, OnStart } from "@flamework/core";
import { ThreatBiasModel } from "../../shared/algorithms/classes/threat-bias";

@Service({})
export class TargetingBiasService implements OnStart {
	private model = new ThreatBiasModel();

	onStart() {}

	public addBias(casterId: string, amount: number, duration: number) {
		this.model.addBias(casterId, amount, duration, os.clock());
	}

	public getBias(casterId: string): number {
		return this.model.getBias(casterId, os.clock());
	}
}

import { Service, OnStart } from "@flamework/core";
import { ThreatBiasModel } from "../../shared/algorithms/classes/threat-bias";
import { getClock } from "shared/utils/time";

@Service({})
export class TargetingBiasService implements OnStart {
	private model = new ThreatBiasModel();

	onStart() { }

	public addBias(casterId: string, amount: number, duration: number) {
		this.model.addBias(casterId, amount, duration, getClock());
	}

	public getBias(casterId: string): number {
		return this.model.getBias(casterId, getClock());
	}
}

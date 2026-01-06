import { Controller, OnStart } from "@flamework/core";

@Controller({})
export class EnemyVFXController implements OnStart {
	onStart() {}

	public playMotif(enemyId: string, motif: string) {
		// Real impl: lookup motif VFX, apply to enemy silhouette
	}
}

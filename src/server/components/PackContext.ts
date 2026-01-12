export class PackContext {
	private members: string[] = []; // GUIDs
	private activeTargets: Set<string> = new Set();
	private isAggroed = false;

	public RegisterMember(guid: string) {
		this.members.push(guid);
	}

	public AlertAll(targetGuid: string) {
		if (this.isAggroed) return;
		this.isAggroed = true;
		this.activeTargets.add(targetGuid);
		
		// Notify all members (placeholder for AI logic)
		print(`[PackContext] Pack Alerted! ${this.members.size()} enemies engaging ${targetGuid}`);
		
		// In real implementation, we would iterate members and set their AI state to Engage
	}

	public AddTarget(targetGuid: string) {
		this.activeTargets.add(targetGuid);
	}
}

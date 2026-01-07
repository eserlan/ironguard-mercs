import { Service } from "@flamework/core";
import { Workspace } from "@rbxts/services";

@Service({})
export class HitDetectionService {
	/**
	 * Performs a raycast from origin in a direction.
	 */
	public raycast(origin: Vector3, direction: Vector3, range: number, ignore: Instance[] = []) {
		const params = new RaycastParams();
		params.FilterDescendantsInstances = ignore;
		params.FilterType = Enum.RaycastFilterType.Exclude;

		return Workspace.Raycast(origin, direction.Unit.mul(range), params);
	}

	/**
	 * Performs a box overlap check.
	 */
	public overlapBox(cframe: CFrame, size: Vector3, ignore: Instance[]): Instance[] {
		const params = new OverlapParams();
		params.FilterDescendantsInstances = ignore;
		params.FilterType = Enum.RaycastFilterType.Exclude;

		return Workspace.GetPartBoundsInBox(cframe, size, params);
	}
}

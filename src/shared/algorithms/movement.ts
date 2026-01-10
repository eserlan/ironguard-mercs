/**
 * Pure functions for dash/movement calculations
 * These functions should have NO Roblox API calls
 */

/**
 * Calculate the new CFrame after a dash movement
 * @param currentCFrame Current position and orientation
 * @param distance Distance to dash forward
 * @returns New CFrame after dash
 */
export function calculateDashCFrame(currentCFrame: CFrame, distance: number): CFrame {
	const direction = currentCFrame.LookVector;
	return currentCFrame.add(direction.mul(distance));
}

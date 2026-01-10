import { describe, it, expect } from 'vitest';
import { calculateDashCFrame } from './movement';

describe('calculateDashCFrame', () => {
	it('dashes forward in the look direction', () => {
		// Create a CFrame at origin facing positive Z
		const start = new CFrame(0, 0, 0);
		const distance = 10;

		const result = calculateDashCFrame(start, distance);

		// Should move 10 studs in the look direction (forward Z)
		expect(result.Position.X).toBeCloseTo(0);
		expect(result.Position.Y).toBeCloseTo(0);
		expect(result.Position.Z).toBeCloseTo(10);
	});

	it('preserves orientation after dash', () => {
		// Create a CFrame with a rotation
		const start = new CFrame(0, 0, 0).mul(CFrame.Angles(0, math.rad(45), 0));
		const distance = 5;

		const result = calculateDashCFrame(start, distance);

		// Orientation should be preserved (comparing look vectors)
		const startLook = start.LookVector;
		const resultLook = result.LookVector;
		expect(resultLook.X).toBeCloseTo(startLook.X);
		expect(resultLook.Y).toBeCloseTo(startLook.Y);
		expect(resultLook.Z).toBeCloseTo(startLook.Z);
	});

	it('handles negative distance (dash backward)', () => {
		const start = new CFrame(0, 0, 0);
		const distance = -10;

		const result = calculateDashCFrame(start, distance);

		// Should move backward (negative Z)
		expect(result.Position.X).toBeCloseTo(0);
		expect(result.Position.Y).toBeCloseTo(0);
		expect(result.Position.Z).toBeCloseTo(-10);
	});

	it('handles zero distance', () => {
		const start = new CFrame(5, 10, 15);
		const distance = 0;

		const result = calculateDashCFrame(start, distance);

		// Position should remain unchanged
		expect(result.Position.X).toBeCloseTo(5);
		expect(result.Position.Y).toBeCloseTo(10);
		expect(result.Position.Z).toBeCloseTo(15);
	});

	it('dashes from arbitrary position and rotation', () => {
		// Start at (10, 5, 20) facing 90 degrees (looking in -X direction)
		const start = new CFrame(10, 5, 20).mul(CFrame.Angles(0, math.rad(90), 0));
		const distance = 8;

		const result = calculateDashCFrame(start, distance);

		// Should move 8 studs in the look direction (-X)
		expect(result.Position.X).toBeCloseTo(10 - 8);
		expect(result.Position.Y).toBeCloseTo(5);
		expect(result.Position.Z).toBeCloseTo(20);
	});
});

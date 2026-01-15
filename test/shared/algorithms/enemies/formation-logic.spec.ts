import { describe, it, expect } from 'vitest';
import { calculateSeparationForce } from '../../../../src/shared/algorithms/enemies/formation-logic';

describe('Formation Logic', () => {
    const myPos = new Vector3(0, 0, 0);
    const targetDir = new Vector3(0, 0, -1);
    const options = { radius: 8, weight: 1.0 };

    it('should return zero force when no neighbors are present', () => {
        const force = calculateSeparationForce(myPos, [], targetDir, options);
        expect(force.Magnitude).toBe(0);
    });

    it('should return zero force when neighbors are outside the radius', () => {
        const neighbors = [new Vector3(20, 0, 0)];
        const force = calculateSeparationForce(myPos, neighbors, targetDir, options);
        expect(force.Magnitude).toBe(0);
    });

    it('should push away from a single close neighbor', () => {
        const neighbors = [new Vector3(5, 0, 0)]; // Neighbor at +5 on X
        const force = calculateSeparationForce(myPos, neighbors, targetDir, options);

        // Force should be in negative X direction (pushing away from +5)
        expect(force.X).toBeLessThan(0);
        expect(force.Y).toBe(0);
        expect(force.Z).toBe(0);

        // New Formula: ((radius - dist) / radius)^2 * 2.5 * weight
        // ((8 - 5) / 8)^2 * 2.5 * 1.0 = 0.3515625
        expect(math.abs(force.Magnitude - 0.3515625)).toBeLessThan(0.01);
    });

    it('should calculate cumulative force from multiple neighbors', () => {
        const neighbors = [
            new Vector3(5, 0, 0),  // Right
            new Vector3(-5, 0, 0), // Left
        ];
        const force = calculateSeparationForce(myPos, neighbors, targetDir, options);

        // Opposite neighbors should cancel each other out
        expect(force.Magnitude).toBeLessThan(0.01);
    });

    it('should project forces onto the XZ plane', () => {
        const neighbors = [new Vector3(5, 100, 0)]; // Neighbor far above us
        const force = calculateSeparationForce(myPos, neighbors, targetDir, options);

        // Vertical offset should be ignored, force should match horizontal distance
        expect(math.abs(force.Magnitude - 0.3515625)).toBeLessThan(0.01);
        expect(force.Y).toBe(0);
    });

    it('should bias separation TANGENTIALLY when targetDir is parallel to push', () => {
        // Target is straight ahead (-Z)
        const tDir = new Vector3(0, 0, -1);
        // Neighbor is also straight ahead (-Z, 5 studs away)
        // Default push would be straight back (+Z), which causes bobbing.
        const neighbors = [new Vector3(0, 0, -5)];

        const force = calculateSeparationForce(myPos, neighbors, tDir, options);

        // Force should be orthogonal to targetDir (mostly on X axis)
        expect(math.abs(force.Z)).toBeLessThan(0.01);
        expect(math.abs(force.X)).toBeGreaterThan(0.3);
    });

    it('should handle very close neighbors without crashing', () => {
        const neighbors = [new Vector3(0.05, 0, 0)]; // Extremely close
        const force = calculateSeparationForce(myPos, neighbors, targetDir, options);

        // Should be capped by the 3.0 clamp
        expect(force.Magnitude).toBeLessThanOrEqual(3.01);
        expect(force.Magnitude).toBeGreaterThan(2.0);
    });
});

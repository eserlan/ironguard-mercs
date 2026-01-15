/**
 * Pure functions for AI formation and group movement.
 * Extracted from AIService to allow for isolated unit testing.
 */

export interface SeparationOptions {
    radius: number;
    weight: number;
}

/**
 * Calculates a "Separation Force" to push an agent away from its neighbors.
 * Returns a Vector3 direction/magnitude to be added to the move target.
 * @param targetDir The direction the agent IS CURRENTLY TRYING to move (e.g. towards player). 
 *                  Used to project separation tangentially to avoid back-and-forth jitter.
 */
export function calculateSeparationForce(
    myPos: Vector3,
    neighborPositions: Vector3[],
    targetDir: Vector3 = new Vector3(0, 0, 0),
    options: SeparationOptions = { radius: 8, weight: 1.0 }
): Vector3 {
    let separationForce = new Vector3(0, 0, 0);

    for (const otherPos of neighborPositions) {
        const diff = myPos.sub(otherPos);
        // PROJECT onto XZ plane to avoid vertical interference
        const horizontalDiff = new Vector3(diff.X, 0, diff.Z);
        const distToOther = horizontalDiff.Magnitude;

        // If within radius and not at the exact same position (to avoid div by zero)
        if (distToOther < options.radius && distToOther > 0.01) {
            const pushDir = horizontalDiff.Unit;

            // TANGENTIAL BIASING:
            // If push direction is nearly parallel to target direction, 
            // it causes "bobbing". We'll nudge the push force to be mostly orthogonal.
            let finalPushDir = pushDir;
            if (targetDir.Magnitude > 0.1) {
                const horizontalTarget = new Vector3(targetDir.X, 0, targetDir.Z).Unit;
                const dot = pushDir.Dot(horizontalTarget);

                // If pushing straight back or straight forward, find an orthogonal "slide" direction
                if (math.abs(dot) > 0.7) {
                    // Create an orthogonal vector (90 deg turn on XZ)
                    const orthogonal = new Vector3(-horizontalTarget.Z, 0, horizontalTarget.X);
                    // Choose the side that is closer to the original push direction
                    const sideMult = pushDir.Dot(orthogonal) > 0 ? 1 : -1;
                    finalPushDir = orthogonal.mul(sideMult).Unit;
                }
            }

            // Normalised push strength [0, 1]
            const pushStrength = (options.radius - distToOther) / options.radius;
            const force = math.pow(pushStrength, 2) * 2.5;

            separationForce = separationForce.add(finalPushDir.mul(force));
        }
    }

    // Clamp total steering strength to prevent extreme values
    if (separationForce.Magnitude > 3.0) {
        separationForce = separationForce.Unit.mul(3.0);
    }

    return separationForce.mul(options.weight);
}

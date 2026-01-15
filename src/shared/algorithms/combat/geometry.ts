export interface Vector3Like {
    X: number;
    Y: number;
    Z: number;
}

/**
 * Checks if a target point is within a defined melee arc relative to an origin and facing direction.
 * logic is 2D (XZ plane) typically for gameplay gameplay, but this implementation does 3D dot product.
 * @param origin The starting point of the attack (e.g. Character HRP)
 * @param facingDir The look direction of the attacker (Normalized)
 * @param targetPos The position of the target
 * @param range The maximum distance of the attack
 * @param arcDegrees The width of the arc in degrees (e.g. 90, 180, 360)
 */
export function isPointInMeleeArc(
    origin: Vector3Like,
    facingDir: Vector3Like,
    targetPos: Vector3Like,
    range: number,
    arcDegrees: number
): boolean {
    const dx = targetPos.X - origin.X;
    const dy = targetPos.Y - origin.Y;
    const dz = targetPos.Z - origin.Z;
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq > range * range) return false;
    if (arcDegrees >= 360) return true;

    // Normalize direction to target
    const dist = math.sqrt(distSq);
    if (dist === 0) return true; // Inside origin

    const toTargetX = dx / dist;
    const toTargetY = dy / dist;
    const toTargetZ = dz / dist;

    const dot = (facingDir.X * toTargetX) + (facingDir.Y * toTargetY) + (facingDir.Z * toTargetZ);

    // Calculate threshold
    const angleThreshold = math.cos(math.rad(arcDegrees / 2));

    return dot >= angleThreshold;
}

export function calculateAoEMultiplier(distance: number, radius: number, hasFalloff: boolean): number {
    if (distance > radius) return 0;
    if (!hasFalloff) return 1;
    
    // Linear falloff: 1.0 at center, 0.25 at edge
    const ratio = distance / radius;
    return 1 - (ratio * 0.75);
}

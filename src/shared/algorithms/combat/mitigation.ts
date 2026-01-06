export function calculateMitigation(damage: number, armor: number): number {
    if (armor < 0) armor = 0;
    const mitigation = 100 / (100 + armor);
    return math.floor(damage * mitigation);
}

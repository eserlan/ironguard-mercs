// Shared UI state for HUD components
export const AppState = {
    health: 100,
    maxHealth: 100,
};

export function updateAppHealth(current: number) {
    AppState.health = current;
}

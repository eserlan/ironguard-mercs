// Shared UI state for HUD components with subscribe pattern
type AppStateShape = {
    health: number;
    maxHealth: number;
};

type AppStateListener = (state: AppStateShape) => void;

let appState: AppStateShape = {
    health: 100,
    maxHealth: 100,
};

const appStateListeners = new Set<AppStateListener>();

export const AppState = {
    // Direct access for reading (roblox-ts doesn't support getters)
    health: appState.health,
    maxHealth: appState.maxHealth,

    /**
     * Subscribe to app state changes. Returns an unsubscribe function.
     */
    subscribe(listener: AppStateListener): () => void {
        appStateListeners.add(listener);
        return () => {
            appStateListeners.delete(listener);
        };
    },
};

export function updateAppHealth(current: number) {
    if (appState.health === current) {
        return;
    }

    appState = {
        ...appState,
        health: current,
    };

    // Update the exported object too
    AppState.health = current;

    for (const listener of appStateListeners) {
        listener(appState);
    }
}

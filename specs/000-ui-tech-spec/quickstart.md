# Developer Guide: Adding UI

**Feature**: 000-ui-tech-spec

## How to add a new Screen

1.  **Create the Component**:
    - Go to `src/client/ui/apps/`.
    - Create `MyScreen.tsx`.
    - Export a functional component: `export function MyScreen() { ... }`.

2.  **Register in Router**:
    - Open `src/client/ui/apps/App.tsx` (or your Router component).
    - Add a case for your screen:
      ```tsx
      {currentScreen === "MyScreen" && <MyScreen />}
      ```

3.  **Triggering it**:
    - In your controller, update the state:
      ```typescript
      // simplistic example
      updateAppState({ currentScreen: "MyScreen" });
      ```

## How to add a Native Effect

1.  **Inject VFXController**:
    - In your system (e.g., `CombatController`), constructor-inject `VFXController`.

2.  **Call the Effect**:
    - `this.vfxController.spawnDamageNumber(position, amount, isCrit);`

3.  **Performance Note**:
    - Do NOT create new `Instance`s inside a `RenderStepped` loop. Use the VFX controller which handles pooling/cleanup.

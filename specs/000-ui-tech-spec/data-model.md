# Data Model: Hybrid UI

**Feature**: 000-ui-tech-spec

## Client State (Ephemeral)

The UI state is transient and managed within the React tree or Flux-like stores (if added later).

### 1. AppState (Root Context)
The top-level state object passed down or accessed via hooks.
- `currentScreen`: "HUD" | "Inventory" | "Settings" | "None"
- `modalStack`: Array<ModalId>
- `debugMode`: boolean

## Component Hierarchy

### 1. Roots
- `AppUI` (ScreenGui): The single Roblox container.
    - `<App />`: The React Root.
        - `<LayerProvider />`: Context provider for Z-indexing.
        - `<Router />`: Switches content based on `currentScreen`.
        - `<Hud />`: Always-visible overlay (Health, Ammo).
        - `<Toasts />`: Notification stack.

### 2. Native Elements (MicroUI)
Managed by `VFXController`, not React.
- `DamageNumber` (BillboardGui):
    - `TextLabel`: Shows value.
    - `Scale`: Tweened 0 -> 1 -> 0.
    - `Offset`: Tweened Upwards.

## Contracts

### React Props Interface
Standardizing common prop patterns.

```typescript
interface BaseProps {
    visible?: boolean;
    zIndex?: number;
    layoutOrder?: number;
}
```

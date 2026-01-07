# UI Technical Requirement: Hybrid Roblox UI + React (roblox-ts)

## Goal
Use a hybrid UI approach:
- React (via `@rbxts/react` + `@rbxts/react-roblox`) for complex, stateful, multi-screen UI.
- Native Roblox Instances (imperative) for tiny, short-lived, localised UI effects.

This must keep the UI maintainable at scale while preserving performance and simplicity for micro-UI.

---

## Approved UI Technologies
- `roblox-ts` (Project Standard)
- `@rbxts/react`, `@rbxts/react-roblox` (Version 17.x)
- Flamework for app/service/controller structure
- Native Roblox UI Instances (`ScreenGui` / `BillboardGui` / `SurfaceGui`) for micro-UI

---

## Architectural Principles

### 1) React is for "Screens & Systems"
React must be used for UI that is:
- state-heavy (depends on player stats, inventory, abilities, matchmaking, settings)
- long-lived (HUD, menus, overlays)
- composed of reusable pieces (buttons, panels, lists, cards)
- conditional/rendered based on multiple inputs

Examples:
- HUD / hotbar / cooldowns / status effects
- Loadout / class selection
- Inventory / shop / crafting
- Party/teammate frames
- Map/mission vote UI
- Settings / keybinds UI

### 2) Native Instances are for "Micro-UI Effects"
Native imperative Roblox UI must be used for:
- short-lived, one-off effects
- high-frequency visual spam where React overhead is not worth it
- UI tied to a single world event and destroyed quickly

Examples:
- floating damage numbers
- hit markers / crit flashes
- small contextual prompts attached to objects (if very simple)
- a single tweened indicator spawned repeatedly

---

## Mounting & Ownership Rules (React)

### 3) Exactly one UI root per Player (Client)
- There must be a single React root created once per local player.
- The root mounts into a single `ScreenGui` parented to `PlayerGui`.
- All React screens are children under this root.

Implementation requirements:
- Create `ScreenGui` named `AppUI` (ResetOnSpawn = false).
- Mount React once in a Flamework client Controller (e.g., `HUDController` or `AppController`).

### 4) Screen Routing
React UI must be structured as:
- `<App />` as the root component
- `<Hud />` always-on layer
- `<Screens />` for menus (loadout/inventory/settings) with a simple router state
- `<Overlays />` for modal dialogs/tooltips

Do NOT create multiple independent roots for each screen.

### 5) No Direct Roblox Instance Mutation from React Children
React components may set props that become Roblox Instance properties, but must not:
- grab instances from the DataModel and mutate them "behind React’s back"
- store mutable Roblox Instances in global singletons for non-React code to modify (read-only references are okay, but prefer React state).

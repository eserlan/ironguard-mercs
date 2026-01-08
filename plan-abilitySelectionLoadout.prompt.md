## Plan: Ability Selection & Loadout Editor for Classes

This plan adds a UI flow for players to view a class's available abilities, select which ones to equip in their 4-slot loadout, and have those abilities appear in the ability bar during gameplay. The system leverages the existing TOP/BOTTOM ability model where each slot has two action variants sharing a cooldown.

### Steps

1. **Register abilities in [`ClassController`](src/client/controllers/ClassController.ts)** — Import and register all class abilities (SHIELD_WALL, RESCUE_LEAP, BASH, LUNGE, EXECUTE, SHADOWSTEP, etc.) into the `AbilityRegistry` alongside existing class registration, adding a `getAll()` method to `AbilityRegistry`.

2. **Create `AbilitySelector.tsx` component in [`src/client/ui/components/`](src/client/ui/components/)** — Build a React component that displays a class's `abilityLibrary` abilities with TOP/BOTTOM variant details (cooldown, effects), allows selecting up to 4 abilities for slots 1-4, and calls `Events.SetLoadout` when confirmed.

3. **Extend [`LobbyController`](src/client/controllers/LobbyController.ts) and `LobbyUiState`** — Add `equippedSlots` state to track the player's current loadout, add a `setLoadout()` method, listen for `LoadoutConfirmed`/`LoadoutRejected` events, and wire through to UI.

4. **Integrate `AbilitySelector` into [`Lobby.tsx`](src/client/ui/apps/Lobby.tsx)** — When at the "Locker" station after selecting a class, show the ability selector panel alongside the mercenary selector, allowing players to configure their loadout before missions.

5. **Implement [`AbilityBar.tsx`](src/client/ui/AbilityBar.tsx)** — Replace placeholder with a real component showing 4 ability slots, each displaying the ability name, TOP/BOTTOM keybind hints, and cooldown state subscribed from server events (`SlotCooldownState`).

6. **Wire `AbilityBar` into [`Hud.tsx`](src/client/ui/apps/Hud.tsx)** — Mount the AbilityBar in the game HUD, passing the confirmed loadout from `LobbyController` state so abilities appear after loadout confirmation.

### Further Considerations

1. **AbilityRegistry persistence** — Should `AbilityRegistry.getAll()` be added or should we iterate through `ClassConfig.abilityLibrary` and call `get()` individually? Recommend adding `getAll()` for cleaner iteration.

2. **Cooldown visualization** — How should TOP vs BOTTOM cooldowns display in the ability bar? Show remaining time with visual fill, or just gray-out when on cooldown?

3. **Default loadout** — Should classes auto-equip a default loadout if player doesn't customize? This would prevent starting a mission with empty slots.


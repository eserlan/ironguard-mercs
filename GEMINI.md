# ironguard-mercs Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-06

## Active Technologies
- N/A (Runtime generation). (004-dungeon-generation)
- TypeScript (roblox-ts -> Luau). (004-dungeon-generation)
- Runtime memory for match state; DataStore (later) for persistence. (004-dungeon-generation)
- TypeScript (roblox-ts) (005-player-classes)
- TypeScript (roblox-ts) + Combat (002) for trigger hooks, Abilities (003) for cooldown integration, Progression (007) for meta unlocks. (008-gear-equipment)
- **Real-Time Combat (001)**: Flamework, React-based UI, Authoritative Server Logic.
- **Git Hooks**: Husky (pre-push) for Linting and TDD.
- TypeScript (roblox-ts -> Luau) + `@rbxts/react`, `@rbxts/react-roblox`, `@flamework/core` (000-ui-tech-spec)
- N/A (Client-side ephemeral UI state) (000-ui-tech-spec)

- Luau (Roblox) + Roblox Engine API (`Workspace`, `ServerStorage`, `CFrame`), TestEZ (for unit testing). (004-dungeon-generation)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for Luau (Roblox)

## Code Style

Luau (Roblox): Follow standard conventions

## Recent Changes
- 000-ui-tech-spec: Added TypeScript (roblox-ts -> Luau) + `@rbxts/react`, `@rbxts/react-roblox`, `@flamework/core`
- 001-core-gameplay: Refined vision to Real-Time Tactical Co-op; added Roster Management and Ironman Mode (Permadeath).


<!-- MANUAL ADDITIONS START -->

### Project Governance

The core architectural principles and immutable development rules for this project are defined in the [CONSTITUTION.md](file:///home/espen/proj/ironguard-mercs/.specify/memory/constitution.md). 

All developers must strictly adhere to the standards defined there, particularly regarding:
- **Test-Driven Development (TDD)**
- **Decoupled Architecture (@Service/@Controller)**
- **UI Safety (Avoid React Fragments)**
- **Pure Functional Logic in Shared**
<!-- MANUAL ADDITIONS END -->

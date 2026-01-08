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
- 001-core-gameplay: Implemented real-time RunStateMachine, Combat hooks, and Permadeath logic.


<!-- MANUAL ADDITIONS START -->

### Manual Project Guidelines

  - No direct commits to the `main` branch.  
  - All changes must go through pull requests with at least one review.  
  - Use Code Review to enforce architectural and gameplay standards.

  - Write tests before or alongside new logic, especially in `src/shared/algorithms`.  
  - Every new shared logic module must have a corresponding `*.spec.ts` test file.  
  - Maintain at least 80% line and function coverage; add or update tests when changing behavior.
  - **Pre-push Hook**: Husky is configured to run `npm run lint` and `npm test` before any push. Do not bypass this check.

  - Use `@Service` for services and `@Controller` for controllers; wire dependencies via constructor injection.  
  - Keep core game math and algorithms as pure functions in `src/shared` (no direct Roblox API calls there).  
  - Abilities should use Top (Server) / Bottom (Client) separation and be composed from reusable effect blocks.  
  - Enemy AI must rely on `TargetingBiasService` scoring rather than hard aggro locks.
<!-- MANUAL ADDITIONS END -->

# ironguard-mercs Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-06

## Active Technologies
- N/A (Runtime generation). (004-dungeon-generation)
- TypeScript (roblox-ts -> Luau). (004-dungeon-generation)
- Runtime memory for match state; DataStore (later) for persistence. (004-dungeon-generation)
- TypeScript (roblox-ts) (005-player-classes)
- TypeScript (roblox-ts) + Combat (002) for trigger hooks, Abilities (003) for cooldown integration, Progression (007) for meta unlocks. (008-gear-equipment)

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
- 001-core-gameplay: Refined vision to Real-Time Tactical Co-op; added Roster Management and Ironman Mode (Permadeath).
- 008-gear-equipment: Added TypeScript (roblox-ts) + Combat (002) for trigger hooks, Abilities (003) for cooldown integration, Progression (007) for meta unlocks.
- 008-gear-equipment: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]
- 008-gear-equipment: Added TypeScript (roblox-ts)


<!-- MANUAL ADDITIONS START -->

### Manual Project Guidelines

- **PR Only Policy**  
  - No direct commits to the `main` branch.  
  - All changes must go through pull requests with at least one review.  
  - Use Code Review to enforce architectural and gameplay standards.

- **TDD Priority**  
  - Write tests before or alongside new logic, especially in `src/shared/algorithms`.  
  - Every new shared logic module must have a corresponding `*.spec.ts` test file.  
  - Maintain at least 80% line and function coverage; add or update tests when changing behavior.

- **Flamework Standards**  
  - Use `@Service` for services and `@Controller` for controllers; wire dependencies via constructor injection.  
  - Keep core game math and algorithms as pure functions in `src/shared` (no direct Roblox API calls there).  
  - Abilities should use Top (Server) / Bottom (Client) separation and be composed from reusable effect blocks.  
  - Enemy AI must rely on `TargetingBiasService` scoring rather than hard aggro locks.
<!-- MANUAL ADDITIONS END -->

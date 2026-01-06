# ironguard-mercs Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-06

## Active Technologies
- N/A (Runtime generation). (004-dungeon-generation)
- TypeScript (roblox-ts -> Luau). (004-dungeon-generation)
- Runtime memory for match state; DataStore (later) for persistence. (004-dungeon-generation)
- TypeScript (roblox-ts) (005-player-classes)

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
- 007-progression-levelup: Added TypeScript (roblox-ts)
- 006-monster-concept: Added TypeScript (roblox-ts)
- 005-player-classes: Added TypeScript (roblox-ts)


<!-- MANUAL ADDITIONS START -->
- **PR Only Policy**: Direct commits to `main` are prohibited. Use feature branches and PRs.
- **TDD Priority**: Always write Vitest specs for `src/shared` logic before implementation.
- **Flamework Standards**: Follow Service/Controller/Component patterns.
<!-- MANUAL ADDITIONS END -->

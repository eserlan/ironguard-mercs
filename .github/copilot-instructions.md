# Copilot Code Review Instructions: IronGuard Mercs

Please follow these guidelines when reviewing pull requests for this project:

## Architectural Standards
- **Flamework DI**: Ensure all services use `@Service` and controllers use `@Controller`. Dependency injection should be handled via constructors.
- **Top/Bottom Model**: Verify that abilities follow the Top (Server) and Bottom (Client) separation. Logic should be in `src/shared/algorithms` where possible.
- **Pure Logic**: Core game math and algorithms MUST be pure functions located in `src/shared`. If you see Roblox API calls (like `Workspace` or `Instance.new`) in `shared/algorithms`, flag it.

## Testing & Coverage
- **Vitest**: Every new logic module in `shared/algorithms` must have a corresponding `.spec.ts` file.
- **Coverage**: Maintain at least 80% line/function coverage.

## Code Quality
- **Types**: Prefer strict typing. Avoid `any` at all costs; use `unknown` or specific interfaces.
- **Naming**: Follow the `camelCase` for variables/functions and `PascalCase` for classes/enums.
- **Performance**: Flag any O(N^2) operations in the game loop or AI scoring logic.

## Specific Rules
- **No Direct Commit to Main**: Ensure all changes come through PRs.
- **Soft Taunt**: Verify that enemy AI uses the `TargetingBiasService` scoring rather than hard aggro locks.
- **Effect Blocks**: Abilities should be composed of reusable effect blocks from the framework.

# Research & Decisions: Hybrid UI

**Feature**: 000-ui-tech-spec

## Decisions

### 1. Library Selection
**Decision**: Use `@rbxts/react` and `@rbxts/react-roblox` (React 17 equivalent).
**Rationale**:
- Standard for `roblox-ts` ecosystem.
- Functional components + Hooks API allows cleaner logic reuse than Roact classes.
**Alternatives Considered**:
- `Roact` (Legacy, verbose).
- `Fusion` (Good for state, but less ecosystem support for complex component libraries than React).

### 2. Mounting Strategy
**Decision**: Single Root in `HudController`.
**Pattern**:
```typescript
const root = createRoot(new Instance("ScreenGui", playerGui));
root.render(<App />);
```
**Rationale**:
- Ensures a single consistent Context tree for the entire application.
- Prevents "fighting" over screen real estate.

### 3. Native Micro-UI Management
**Decision**: Centralized `VFXController` using `Maid` for cleanup.
**Rationale**:
- Floating text needs to be fire-and-forget.
- React's overhead for spawning 100+ individual instances per second is measurable on low-end devices.
- `TweenService` on the C++ side is more performant than Lua-based springs for simple linear motion.

## Unknowns Resolution
*   **Q: Router Library?** -> **A: None**. Use simple conditional rendering (`if (state.screen === 'Inventory') return <Inventory />`) for the MVP. Add a router later if depth increases.

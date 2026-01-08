# Implementation Plan: UI Technical Requirement (Hybrid)

**Branch**: `000-ui-tech-spec` | **Date**: 2026-01-07
**Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/000-ui-tech-spec/spec.md`

## Summary

Establish the "Hybrid UI" architecture for IronGuard Mercs. We will scaffold the `AppUI` root for React-based screens and the `MicroUI` layer for native Roblox instances. This plan covers the installation of React dependencies (`@rbxts/react`), the creation of the root mounting controller (`HudController`), and the verification of the hybrid rendering pipeline.

## Technical Context

**Language/Version**: TypeScript (roblox-ts -> Luau)
**Primary Dependencies**: `@rbxts/react`, `@rbxts/react-roblox`, `@flamework/core`
**Storage**: N/A (Client-side ephemeral UI state)
**Testing**: Manual verification for rendering; Vitest for Controller logic (where applicable).
**Target Platform**: Roblox Client
**Project Type**: Roblox Game (Client)
**Performance Goals**: 60 FPS for Native Micro-UI elements (damage numbers).
**Constraints**: Single React Root per client.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Modular Architecture**: Separates "Screens" (React) from "Effects" (Native).
- [x] **Test-Driven Quality**: Verification steps included for both pipelines.
- [x] **Documentation First**: Spec defined before implementation.
- [x] **Clean Code**: Enforces strict separation of concerns via Flamework Controllers.

## Project Structure

### Documentation (this feature)

```text
specs/000-ui-tech-spec/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (Component Hierarchy)
├── quickstart.md        # Phase 1 output (Developer Guide)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── client/
│   ├── controllers/
│   │   ├── HudController.ts   # React Mount Point
│   │   └── VFXController.ts   # Native Micro-UI Manager
│   └── ui/
│       ├── apps/
│       │   └── App.tsx        # React Root Component
│       └── components/        # Reusable Atoms/Molecules
└── types_shim.d.ts
```

**Structure Decision**: Adhering to standard `roblox-ts` + Flamework client structure. React components live in `src/client/ui`, controllers in `src/client/controllers`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| React     | Complex State Management | Pure Roblox UI is unmaintainable for complex menus (Inventory, Trees). |
| Native UI | Performance | React reconciliation is too slow for 100+ damage numbers/sec. |
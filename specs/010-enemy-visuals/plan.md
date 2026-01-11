# Implementation Plan: Humanoid Enemy Visual Pipeline (MVP)

**Branch**: `010-enemy-visuals` | **Date**: 2026-01-11 | **Spec**: [specs/010-enemy-visuals/spec.md](./spec.md)
**Input**: Feature specification from `specs/010-enemy-visuals/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements a data-driven visual pipeline for humanoid enemies using a single shared R15 rig. It introduces `VisualProfile` data structures to define assets (accessories, clothing) and scaling, which are applied at runtime by a new `EnemyVisualService` using `HumanoidDescription`. This ensures rapid iteration and strictly decouples visuals from combat logic.

## Technical Context

**Language/Version**: TypeScript (roblox-ts 2.3+) -> Luau
**Primary Dependencies**: @flamework/core, @rbxts/services
**Storage**: ServerStorage (for Assets), ModuleScripts (for Data Profiles)
**Testing**: Vitest (Unit/Integration)
**Target Platform**: Roblox Server (Linux/Windows execution environment)
**Project Type**: Single project (Roblox game)
**Performance Goals**: Visual setup < 100ms per entity
**Constraints**: No custom meshes, shared rig only, idempotent application
**Scale/Scope**: < 500 lines of code, purely additive to existing enemy spawn flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Modular Architecture**: ✅ Uses `EnemyVisualService` (Flamework) to encapsulate logic.
- **Pure Game Logic**: ✅ Visual profiles are pure data in `shared/domain`.
- **Test-Driven Quality**: ✅ Plan includes independent tests for profile application.
- **Enemy AI Design**: ✅ Visuals are decoupled from `TargetingBiasService` and combat logic.
- **Clean Code**: ✅ Adheres to project naming and structure.

## Project Structure

### Documentation (this feature)

```text
specs/010-enemy-visuals/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - internal service)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── server/
│   └── services/
│       └── EnemyVisualService.ts  # Core logic
├── shared/
│   └── domain/
│       └── enemies/
│           ├── visual-types.ts    # Interfaces
│           └── visual-profiles.ts # Data definitions
└── test/
    └── server/
        └── EnemyVisualService.spec.ts # Integration tests
```

**Structure Decision**: Standard Flamework Service pattern with shared domain data.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
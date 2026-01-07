# Implementation Plan: Gear & Equipment System

**Branch**: `008-gear-equipment` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Bounded gear system providing tactical utility and build expression without replacing class identity or creating permanent power gaps.

## Summary

This plan defines the implementation of the Gear & Equipment system—a set of equippable items that enhance characters through conditional effects, utility actions, and light stat nudges. The system complements class abilities, encourages situational adaptation, and remains readable in fast-paced co-op play. Gear provides *contextual power* (conditional, triggered, cooldown-based) rather than raw stat scaling.

## Technical Context

**Language/Version**: TypeScript (roblox-ts)
**Architecture**: Flamework (DI, Services, Components)
**Primary Dependencies**: Combat (002) for trigger hooks, Abilities (003) for cooldown integration, Progression (007) for meta unlocks.
**Testing**: Vitest (pure gear logic, cap enforcement, trigger conditions), TestEZ (UI integration).
**Target Platform**: Roblox Client/Server.
**Performance Goals**: Gear effect application < 16ms (single frame); UI equip flow < 100ms response.
**Constraints**: 
- Server-authoritative equipment state and effect validation.
- Gear swaps restricted to Safe Rooms only.
- Global caps on stacking modifiers (CDR, damage amp, CC duration).
- Max 1 Exotic/Relic item equipped at a time.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Modular Architecture**: Gear logic isolated in `src/shared/domain/gear` and `src/shared/algorithms/gear`.
- [x] **Test-Driven Quality**: Cap enforcement, trigger conditions, and stacking rules unit-tested.
- [x] **Documentation First**: This plan and spec precede implementation.
- [x] **Iterative Delivery**: Starting with core schema and slot model before content.

## Project Structure

### Documentation

```text
specs/008-gear-equipment/
├── plan.md              # This file
├── research.md          # Gear system analysis from other games
├── data-model.md        # Gear schemas and effect definitions
├── quickstart.md        # Authoring guide for new gear items
├── tuning.md            # Drop rates, rarity weights, power budgets
└── contracts/           # Equip/unequip remotes, effect sync
```

### Source Code

```text
src/
├── shared/
│   ├── domain/
│   │   └── gear/           # GearItem, EquipmentSlot, GearType, GearRarity schemas
│   ├── algorithms/
│   │   └── gear/           # Pure Logic (TESTED):
│   │       ├── gear-caps.ts       # Global cap enforcement (CDR, dmg amp)
│   │       ├── stacking-rules.ts  # Multi-gear modifier stacking
│   │       ├── compatibility.ts   # Class filter and slot validation
│   │       └── trigger-eval.ts    # Condition evaluation (on_block, on_hit, etc.)
│   └── net.ts              # Equip/unequip events, effect sync payloads
├── server/
│   ├── services/
│   │   ├── GearService.ts         # Equipment state, validation, persistence
│   │   ├── GearEffectService.ts   # Effect application, trigger listeners
│   │   ├── GearLootService.ts     # Drop generation, pool weighting
│   │   └── GearInventoryService.ts # Stash/sideboard management
│   └── components/
│       └── PlayerGearCmpt.ts      # Per-player equipment state component
├── client/
│   ├── controllers/
│   │   ├── GearController.ts      # Equip UI, input binding for actives
│   │   └── GearVFXController.ts   # Proc feedback, cooldown display
│   └── ui/
│       ├── GearPanel.tsx          # Equipment slots, inventory view
│       ├── GearTooltip.tsx        # Inspect, compare, stats
│       └── ActiveGearHUD.tsx      # Cooldown bar, charge counter
```

---

## Phases

### Phase 1: System Rules (Gear Contract)

**Goal**: Establish the immutable rules that govern all gear behaviour.

| Task | Description |
|------|-------------|
| 1.1 | Define gear philosophy document (contextual power, no core mechanic replacement) |
| 1.2 | Define slot model: 4 slots (Weapon, Offhand, Armour, Utility) with extension hooks |
| 1.3 | Define swap rules: Safe Rooms only, no mid-combat swapping |
| 1.4 | Define rarity bands: Common, Uncommon, Rare, Exotic with power budgets |
| 1.5 | Define stacking rules and global caps (CDR max 40%, damage amp max 25%, CC duration max 30%) |
| 1.6 | Define class compatibility rules (weapon/offhand class filters) |

**Output**: `research.md` with rules rationale, `data-model.md` with cap constants.

---

### Phase 2a: UX Design (Gear Interface)

**Goal**: Define the player-facing experience for gear management.

| Task | Description |
|------|-------------|
| 2a.1 | Define gear panel layout (equipped slots, stash/sideboard, drag-drop) |
| 2a.2 | Define inspect/compare flow (stat deltas, effect descriptions) |
| 2a.3 | Define equip/unequip confirmation (class compatibility warnings) |
| 2a.4 | Define pickup decision timing (immediate stash vs. choice prompt) |
| 2a.5 | Define readability requirements (VFX for procs, icons for active cooldowns) |

**Output**: UI mockups in `research.md`, UX flow diagrams.

---

### Phase 2b: Runtime Integration (Gear Mechanics)

**Goal**: Wire gear effects into Combat (002) and Abilities (003) systems.

| Task | Description |
|------|-------------|
| 2b.1 | Define trigger hooks in CombatService (on_block, on_hit, on_damage_taken, on_kill) |
| 2b.2 | Define active gear input mapping (dedicated keybind or ability bar slot) |
| 2b.3 | Define cooldown system integration (shared vs. independent cooldowns) |
| 2b.4 | Define reactive gear event subscription model |
| 2b.5 | Define consumable charge tracking and replenishment timing |

**Output**: `contracts/gear-events.md` with remote definitions.

---

### Phase 3: Acquisition & Economy

**Goal**: Define how players obtain gear and manage loot fairness.

| Task | Description |
|------|-------------|
| 3.1 | Define acquisition sources: enemy drops, chest rewards, vendors, objective bonuses |
| 3.2 | Define loot fairness rules: personal drops vs. shared pool, duplicate protection |
| 3.3 | Define reroll/salvage rules (if any) and currency model |
| 3.4 | Define gear pools by biome/tier and rarity weighting curves |
| 3.5 | Define meta-progression integration: unlockable gear pools via 007-progression-levelup |

**Output**: `tuning.md` with drop rate tables, `data-model.md` with pool definitions.

---

### Phase 4: Data Schema & Authoring

**Goal**: Create the authoritative gear data format and effect library.

| Task | Description |
|------|-------------|
| 4.1 | Define gear JSON/TypeScript schema (id, name, slot, type, rarity, triggers, effects, cooldown, charges, caps) |
| 4.2 | Define effect library: common triggers (on_block, on_hit, after_ability) and outcomes (buff, damage, heal) |
| 4.3 | Define tagging system: synergy tags, exclusion groups, categories |
| 4.4 | Define authoring template and validation tooling |
| 4.5 | Create documentation for content designers in `quickstart.md` |

**Output**: `data-model.md` with full schema, `quickstart.md` with authoring guide.

---

### Phase 5: Initial Content Set (v1)

**Goal**: Create a balanced starter set of gear items.

**Scope**: 32 items minimum (2 per slot × 4 slots × 4 rarities)

| Task | Description |
|------|-------------|
| 5.1 | Create 8 Weapon items (2 per rarity, class-filtered) |
| 5.2 | Create 8 Offhand items (2 per rarity, defensive/utility split) |
| 5.3 | Create 8 Armour items (2 per rarity, resistance-themed) |
| 5.4 | Create 8 Utility items (2 per rarity, active/consumable split) |
| 5.5 | Create 2 Exotic/Relic items with unique mechanics (one-equipped-max) |
| 5.6 | Validate each item: clear trigger → outcome → counterbalance |

**Output**: Gear data files in `src/shared/data/gear/`, `checklists/gear-content.md`.

---

### Phase 6: Integration Testing

**Goal**: Validate gear works correctly with dependent systems.

| Task | Description |
|------|-------------|
| 6.1 | Test gear triggers fire correctly from Combat (002) hooks |
| 6.2 | Test active gear respects Abilities (003) cooldown system |
| 6.3 | Test gear effects don't conflict with Progression (007) level-up UI timing |
| 6.4 | Test equip/unequip flow in Safe Rooms only |
| 6.5 | Test Exotic limit enforcement (max 1 equipped) |
| 6.6 | Test stacking caps enforced across multiple gear pieces |

**Output**: Test suite in `src/shared/algorithms/gear/__tests__/`, integration tests.

---

### Phase 7: Balance, Telemetry & Iteration

**Goal**: Ensure gear enhances gameplay without overshadowing classes.

| Task | Description |
|------|-------------|
| 7.1 | Validate gear does not overshadow class kits via damage/utility logs |
| 7.2 | Tune drop rates and rarity weights based on run length |
| 7.3 | Tune choice frequency (how often players see gear decisions) |
| 7.4 | Add telemetry: equip rates, win rates by gear, proc frequency |
| 7.5 | Iterate based on co-op playtests and frustration metrics |

**Output**: Updated `tuning.md`, telemetry dashboards.

---

## Dependencies & Integration Points

| System | Integration |
|--------|-------------|
| **Combat (002)** | Trigger hooks: on_block, on_hit, on_damage_taken, on_kill, on_interrupt |
| **Abilities (003)** | Active gear uses shared cooldown infra; no ability slot overlap |
| **Progression (007)** | Meta unlocks add gear to loot pools; no Run-level gear stat scaling |
| **DataService (001)** | Persist unlocked gear library and equipped loadout |

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 4 Gear Types | Tactical depth | Single type (passive-only) lacks active utility expression. |
| Global Caps | Balance | Uncapped stacking trivialises encounters and invalidates class kits. |
| Safe Room Swap Only | Pacing | Mid-combat swapping creates unfair advantage and UI clutter. |
| Exotic Limit | Build identity | Unlimited exotics make builds homogeneous (always stack best). |

---

## Open Questions (from spec.md)

| Question | Owner | Impact |
|----------|-------|--------|
| Q1: Gear Drop Mechanics | Design | Blocks Phase 3 |
| Q2: Meta Progression Integration | Design | Blocks Phase 3.5 |
| Q3: Gear Set Bonuses | Design | Deferred to v2 |
| Q4: Trading/Sharing | Design | Deferred to v2 |

# Gear & Equipment (Core Concept)

**Status**: Draft
**Owner**: Gemini Agent
**Created**: 2026-01-07
**Feature Branch**: `008-gear-equipment`
**Input**: Gear and Equipment provide situational power, tactical utility, and build expression without replacing class abilities or progression choices.

## Summary

This feature defines the Gear & Equipment system for IronGuard Mercs—a set of equippable items that enhance characters through conditional effects, utility actions, and light stat nudges. Gear is designed to complement classes and abilities, encourage situational adaptation, and remain readable in fast-paced co-op play without creating permanent power gaps between players.

## Problem / Why

Without a structured equipment system, combat depth relies entirely on class abilities and progression choices, limiting build expression and tactical flexibility. We need gear that:
- Adds meaningful moment-to-moment decisions beyond ability rotations
- Creates variety between runs and players using the same class  --name "Gear & Equipment (Core Concept)" \
  --summary "Gear and Equipment provide situational power, tactical utility, and build expression without replacing class abilities or progression choices." \
  --description "$(cat <<'EOF'
Gear and Equipment are equippable items found or earned during a run (and unlocked via meta progression). They enhance a character through conditional effects, utility actions, or light stat nudges, but never override class identity or skill-based play.

The system is designed to:
- Complement classes and abilities, not replace them
- Encourage situational decision-making and adaptation
- Avoid inventory micromanagement
- Remain readable in fast-paced co-op play
- Prevent permanent power gaps between players

Gear is impactful, but bounded.

---

Gear Philosophy
- Gear provides *contextual power*, not raw scaling.
- Most effects are conditional, triggered, or cooldown-based.
- Flat stat bonuses are small, capped, and secondary.
- Gear should feel like “tools”, not mandatory optimisation layers.

---

Equipment Slots (example)
- Weapon (class-compatible only)
- Offhand / Focus (shields, relics, tomes, tools)
- Armour (defensive identity, resistances)
- Utility Gear (gadgets, charms, consumable-like actives)

Slot rules:
- Limited slots by default.
- Slots may be unlocked via meta progression (options only).
- Gear swaps are restricted to Safe Rooms / Intermissions.

---

Gear Types
- Passive Gear: always-on conditional effects (e.g., “after blocking, gain X”)
- Active Gear: grants an extra button with cooldown (shared or independent)
- Reactive Gear: triggers on events (hit taken, interrupt, stagger, revive)
- Consumable Gear: limited charges, replenished between rooms or runs

---

Rarity & Power Bands
- Common: simple, reliable effects
- Uncommon: conditional or synergistic effects
- Rare: strong build-shaping interactions
- Exotic / Relic: unique mechanics (one equipped max)

Rules:
- Rarity affects *complexity*, not just power.
- Gear power is budgeted per rarity band.
- Multiple gear pieces cannot stack the same modifier beyond caps.

---

Class Interaction Rules
- Gear must never:
  - Grant core class mechanics
  - Replace key class abilities
  - Bypass cooldown or interrupt rules
- Gear may:
  - Enhance class strengths
  - Offer alternative utility paths
  - Create cross-class synergies

---

Co-op & Readability Constraints
- Gear effects must be visible or communicated (VFX, icons, cues).
- No hidden procs that surprise teammates.
- Gear-triggered CC follows the same caps as abilities.

---

Authoring Template (per gear item)
- Name & short fantasy/utility identity
- Slot type
- Passive / Active / Reactive / Consumable
- Effect description (trigger → outcome)
- Cooldown / charges (if applicable)
- Rarity & power band
- Class compatibility (if any)
- Synergy tags
- Exclusions / caps

---

Out of Scope (v1)
- Full inventory management
- Gear crafting or upgrading mid-run
- Gear durability or breakage
- Permanent stat scaling via gear
  --name "Gear & Equipment (Core Concept)" \
  --summary "Gear and Equipment provide situational power, tactical utility, and build expression without replacing class abilities or progression choices." \
  --description "$(cat <<'EOF'
Gear and Equipment are equippable items found or earned during a run (and unlocked via meta progression). They enhance a character through conditional effects, utility actions, or light stat nudges, but never override class identity or skill-based play.

The system is designed to:
- Complement classes and abilities, not replace them
- Encourage situational decision-making and adaptation
- Avoid inventory micromanagement
- Remain readable in fast-paced co-op play
- Prevent permanent power gaps between players

Gear is impactful, but bounded.

---

Gear Philosophy
- Gear provides *contextual power*, not raw scaling.
- Most effects are conditional, triggered, or cooldown-based.
- Flat stat bonuses are small, capped, and secondary.
- Gear should feel like “tools”, not mandatory optimisation layers.

---

Equipment Slots (example)
- Weapon (class-compatible only)
- Offhand / Focus (shields, relics, tomes, tools)
- Armour (defensive identity, resistances)
- Utility Gear (gadgets, charms, consumable-like actives)

Slot rules:
- Limited slots by default.
- Slots may be unlocked via meta progression (options only).
- Gear swaps are restricted to Safe Rooms / Intermissions.

---

Gear Types
- Passive Gear: always-on conditional effects (e.g., “after blocking, gain X”)
- Active Gear: grants an extra button with cooldown (shared or independent)
- Reactive Gear: triggers on events (hit taken, interrupt, stagger, revive)
- Consumable Gear: limited charges, replenished between rooms or runs

---

Rarity & Power Bands
- Common: simple, reliable effects
- Uncommon: conditional or synergistic effects
- Rare: strong build-shaping interactions
- Exotic / Relic: unique mechanics (one equipped max)

Rules:
- Rarity affects *complexity*, not just power.
- Gear power is budgeted per rarity band.
- Multiple gear pieces cannot stack the same modifier beyond caps.

---

Class Interaction Rules
- Gear must never:
  - Grant core class mechanics
  - Replace key class abilities
  - Bypass cooldown or interrupt rules
- Gear may:
  - Enhance class strengths
  - Offer alternative utility paths
  - Create cross-class synergies

---

Co-op & Readability Constraints
- Gear effects must be visible or communicated (VFX, icons, cues).
- No hidden procs that surprise teammates.
- Gear-triggered CC follows the same caps as abilities.

---

Authoring Template (per gear item)
- Name & short fantasy/utility identity
- Slot type
- Passive / Active / Reactive / Consumable
- Effect description (trigger → outcome)
- Cooldown / charges (if applicable)
- Rarity & power band
- Class compatibility (if any)
- Synergy tags
- Exclusions / caps

---

Out of Scope (v1)
- Full inventory management
- Gear crafting or upgrading mid-run
- Gear durability or breakage
- Permanent stat scaling via gear

- Provides loot incentives and discovery rewards during dungeon runs
- Avoids inventory bloat and micromanagement that slows co-op pacing

## Proposal / What

We will implement a **Bounded Gear System** where equipment provides *contextual power* (conditional, triggered, or cooldown-based effects) rather than raw stat scaling.

### Gear Philosophy
- Gear provides *contextual power*, not raw scaling.
- Most effects are conditional, triggered, or cooldown-based.
- Flat stat bonuses are small, capped, and secondary.
- Gear should feel like "tools", not mandatory optimisation layers.

### Equipment Slots
| Slot | Examples | Identity |
|------|----------|----------|
| **Weapon** | Swords, Hammers, Staves | Class-compatible only; defines primary attack style |
| **Offhand / Focus** | Shields, Relics, Tomes, Tools | Defensive or utility identity |
| **Armour** | Plate, Robes, Leathers | Defensive identity, resistances |
| **Utility Gear** | Gadgets, Charms, Consumables | Active abilities with cooldown/charges |

**Slot Rules**:
- Limited slots by default (4 slots total).
- Additional slots may be unlocked via meta progression (options only, not power).
- Gear swaps are restricted to Safe Rooms / Intermissions (no mid-combat swapping).

### Gear Types
| Type | Behaviour | Example |
|------|-----------|---------|
| **Passive Gear** | Always-on conditional effects | "After blocking, gain 10% haste for 3s" |
| **Active Gear** | Grants an extra button with cooldown | "Deploy decoy (20s cooldown)" |
| **Reactive Gear** | Triggers on events | "On hit taken, gain 5% damage reduction (stacks 3x)" |
| **Consumable Gear** | Limited charges, replenished between rooms/runs | "Healing Salve: Restore 25% HP (3 charges)" |

### Rarity & Power Bands
| Rarity | Complexity | Power Band |
|--------|------------|------------|
| **Common** | Simple, reliable effects | Baseline |
| **Uncommon** | Conditional or synergistic effects | +1 tier |
| **Rare** | Strong build-shaping interactions | +2 tier |
| **Exotic / Relic** | Unique mechanics (one equipped max) | +3 tier |

**Rarity Rules**:
- Rarity affects *complexity*, not just power.
- Gear power is budgeted per rarity band.
- Multiple gear pieces cannot stack the same modifier beyond caps.
- Only 1 Exotic/Relic item may be equipped at a time.

### Class Interaction Rules

**Gear must NEVER**:
- Grant core class mechanics (e.g., Paladin block to non-Paladin)
- Replace key class abilities
- Bypass cooldown or interrupt rules

**Gear MAY**:
- Enhance class strengths (e.g., "Block restores stamina" for tanks)
- Offer alternative utility paths (e.g., mobility for slow classes)
- Create cross-class synergies (e.g., "When ally blocks, gain haste")

### Co-op & Readability Constraints
- Gear effects must be visible or communicated (VFX, icons, cues).
- No hidden procs that surprise teammates.
- Gear-triggered CC follows the same caps as abilities.

### User Scenarios & Testing

#### User Story 1 - Equipping Gear in Safe Room (Priority: P1)
**Description**: During a Safe Room, I open my inventory, see available gear, and equip a new item to my Offhand slot.
**Value**: Core loop for gear interaction—must be intuitive and fast.
**Independent Test**: Open inventory in Safe Room. Equip item. Verify slot shows new item and old item returns to pool.
**Acceptance Scenarios**:
1. **Given** a player is in a Safe Room with unequipped gear, **When** they select an item and choose "Equip", **Then** the item appears in the correct slot.

#### User Story 2 - Passive Gear Effect Triggers (Priority: P1)
**Description**: I equip a passive item "After blocking, gain 10% haste for 3s". In combat, I block an attack and see a haste buff applied with visible VFX.
**Value**: Validates the core passive trigger system.
**Independent Test**: Equip passive gear. Block attack. Verify buff is applied with correct duration and visual feedback.
**Acceptance Scenarios**:
1. **Given** a player has passive gear equipped, **When** the trigger condition occurs, **Then** the effect activates with visual feedback.

#### User Story 3 - Active Gear Cooldown (Priority: P2)
**Description**: I equip an active gadget with a 20s cooldown. I press the button to activate it, then cannot use it again until the cooldown expires.
**Value**: Validates active gear button and cooldown system.
**Independent Test**: Equip active gear. Activate. Verify cooldown starts and prevents reactivation.
**Acceptance Scenarios**:
1. **Given** a player has active gear, **When** they activate it, **Then** cooldown starts and UI shows remaining time.

#### User Story 4 - Consumable Charge Tracking (Priority: P2)
**Description**: I equip a consumable with 3 charges. I use it twice during a room. In the next Safe Room, I see charges replenished.
**Value**: Validates charge system and replenishment between rooms.
**Independent Test**: Equip consumable. Use charges. Enter Safe Room. Verify charges replenished.

#### User Story 5 - Rarity Restriction: Exotic Limit (Priority: P2)
**Description**: I try to equip a second Exotic item while one is already equipped. The system prevents this and shows an error.
**Value**: Enforces rarity restrictions for balance.
**Independent Test**: Equip one Exotic item. Try to equip another. Verify error message and prevention.

### Requirements

#### Functional
- **FR-001**: System MUST support 4 equipment slots: Weapon, Offhand, Armour, Utility.
- **FR-002**: System MUST enforce gear type behaviours: Passive, Active, Reactive, Consumable.
- **FR-003**: System MUST enforce rarity restrictions (max 1 Exotic equipped).
- **FR-004**: System MUST enforce modifier stacking caps.
- **FR-005**: Gear swaps MUST only occur in Safe Rooms.
- **FR-006**: Active gear MUST have cooldowns enforced server-side.
- **FR-007**: Passive/Reactive gear MUST trigger from event system hooks.
- **FR-008**: Consumable charges MUST replenish between rooms/runs (configurable).
- **FR-009**: Gear effects MUST have visible VFX or UI feedback.
- **FR-010**: Class-specific gear MUST validate class compatibility on equip.

#### Key Entities
- **GearItem**: Definition of a gear piece (id, name, slot, type, rarity, effects, class_filter, synergy_tags).
- **EquipmentSlot**: Enum of available slots (Weapon, Offhand, Armour, Utility).
- **GearType**: Enum (Passive, Active, Reactive, Consumable).
- **GearRarity**: Enum (Common, Uncommon, Rare, Exotic).
- **PlayerEquipment**: Player's currently equipped gear across slots.
- **GearEffectHandler**: System that processes gear triggers and applies effects.

### Edge Cases
- Player unequips Exotic item—should they be able to immediately equip another?
- Gear effect triggers during boss phase with level-up queue active.
- Player with no gear in a slot attempts action that expects gear.
- Consumable charges at 0—prevent activation vs. show disabled.
- Gear effect conflicts with class ability (same buff type).

## Technical / How

**Platform**: Roblox (roblox-ts / Flamework).
Building on the **Combat System (002)** and **Ability Framework (003)** foundations.

- **GearService**: Server-side service managing equipment state and validation.
- **GearEffectProcessor**: Integrates with `CombatService` event hooks for trigger detection.
- **EquipmentController**: Client-side controller for inventory UI and equip actions.
- **GearDataStore**: Persistence for unlocked gear (meta progression) and run equipped state.
- **VFX Integration**: Leverage existing ability VFX system for gear feedback.

## Risks

- **Power Creep**: Gear effects gradually become mandatory for viability.
  *Mitigation*: Strict power budgets per rarity; no flat damage/HP scaling.
- **UI Clutter**: Too many gear effects creating visual noise.
  *Mitigation*: Standardized icon system; effect batching for multiple procs.
- **Balance with Abilities**: Gear effects that outshine class abilities.
  *Mitigation*: Class interaction rules; gear effects capped below ability impact.

### Acquisition & Economy
Gear is acquired dynamically during a run to encourage adaptation without micromanagement.
*   **Loot Caches**: A chest appears upon clearing a room objective or a wave set.
*   **Elite/Boss Drops**: Defeating high-tier enemies provides guaranteed gear drops.
*   **Safe Room Evaluation**: Players can only equip or swap gear during these low-pressure windows.
*   **Personal Loot**: All gear is instanced per player; there is no trading or dropping items for teammates.

### Meta Progression Integration
Unlocks from the **Progression System (007)** expand the variety of gear available in runs.
*   **Pool Expansion**: Reaching meta-level milestones unlocks new gear archetypes (e.g., "Exotic Utility" or "Rare Weapons").
*   **No Power Gating**: Unlocks provide new *options* and *synergies*, not higher baseline stats.

### User Scenarios & Testing
... (existing scenarios) ...

## Open Questions

- **Q1: Gear Drop Mechanics**: Resolved (Chests at room clear + Elite/Boss drops).
- **Q2: Meta Progression Integration**: Resolved (Meta-levels unlock new items in the global drop pool).
- **Q3: Gear Set Bonuses**: Resolved (Deferred to v2).
- **Q4: Trading/Sharing**: Resolved (No trading; Personal loot only).

## Success Criteria

- **SC-001**: Player equips gear and sees effect trigger within first 30 seconds of combat.
- **SC-002**: Average gear swap time in Safe Room < 5 seconds.
- **SC-003**: No gear effect exceeds ability-tier impact (validated via damage logs).
- **SC-004**: 100% of gear effects have visible VFX or UI cue.
- **SC-005**: Exotic restriction enforced—no player can have 2 Exotics simultaneously.

---

## Out of Scope (v1)

- Full inventory management
- Gear crafting or upgrading mid-run
- Gear durability or breakage
- Permanent stat scaling via gear

---

## Authoring Reference

When defining individual gear items, use this template:

```yaml
name: "Ironwall Buckler"
slot: Offhand
type: Reactive
trigger: "On block"
effect: "Gain 10% damage reduction for 3s"
cooldown: 8s
rarity: Uncommon
class_filter: [Paladin, Vanguard]
synergy_tags: [defensive, block_synergy]
exclusions: []
```

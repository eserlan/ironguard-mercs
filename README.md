# IronGuard Mercs

A replayable, session-based action game built on Roblox using **roblox-ts** and the **Flamework** framework. IronGuard Mercs emphasizes tactical teamwork, readable combat, and deep build variety through a deterministic procedural run flow.

## 🚀 Vision
Command an elite squad of mercenaries through high-stakes operations where positioning, cooldown management, and co-op coordination determine survival.

## 🛠 Tech Stack
- **Language**: TypeScript (roblox-ts)
- **Architecture**: Flamework (Dependency Injection, Services, Controllers)
- **Networking**: Server-authoritative with optimistic client prediction.
- **Reactive Streams**: `typescript-rx` for game state and telemetry.
- **Testing**: **Vitest** for pure logic (running in Node.js) and code coverage.
- **Tooling**: Rojo, ESLint, Prettier.

## 🏗 Core Systems

### 1. Procedural Generation
- **Connector-Based Growth**: Deterministic layout generation from a seed.
- **Tile-Based**: Assembles authored 3D models with strict cardinal connector rules.
- **Metadata Pass**: Automated extraction of spawn nodes and objective locations.

### 2. Authoritative Combat
- **Real-Time Engine**: Skills, cooldowns, and damage are fully server-owned.
- **Hybrid Targeting**: Soul-like soft-lock mechanics for responsive feel.
- **Damage Pipeline**: Data-driven mitigation, critical hits, and status effects.

### 3. Abilities & Classes
- **TOP/BOTTOM Model**: Every ability slot offers two tactical variants sharing a cooldown bucket.
- **Hybrid Logic**: 90% component-based authoring with scriptable exceptions.
- **Shield Saint & Ashblade**: Initial archetypes establishing Anchor vs. Duelist roles.

### 4. Monsters & AI
- **Readable Threat**: Telegraphed attacks with visual ground markers.
- **Hybrid Interrupts**: "Soft Casts" (tag-based) and "Hard Casts" (Break Meters).
- **Blended Targeting**: AI scoring that weights class-based "Threat Bias" against role-specific priorities.

### 5. Progression
- **Hybrid Model**: Run-based power (resets) + Meta-based breadth (persistent unlocks).
- **Team Power Level**: Squad-wide XP sharing to prevent intra-team power gaps.
- **Tiered UX**: Level-up choices occur in Safe Rooms or trigger a brief "Micro Slow" in combat.

## 🧪 Development & Testing

### Prerequisites
- Node.js (LTS)
- Rojo (`rojo serve`)
- roblox-ts (`npm install -G roblox-ts`)

### Commands
- **Install**: `npm install`
- **Build**: `npm run build`
- **Test**: `npm test` (Runs Vitest unit tests for pure logic)
- **Coverage**: `npm run coverage`

## 📜 Documentation
Full specifications and implementation plans are located in the `specs/` directory, following the **Spec Kit** design-first methodology.

---
**Status**: Initial Vertical Slice Complete (Logic-Complete).

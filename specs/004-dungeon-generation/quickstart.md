# Quickstart: IronGuard Mercs (roblox-ts)

**Scope**: Full Game + Dungeon Gen

## Prerequisites

1.  **Node.js**: LTS version.
2.  **Rojo**: `rojo --version` >= 7.0.
3.  **roblox-ts**: `npm install -g roblox-ts`.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Build & Sync**:
    ```bash
    npm run build -- --watch
    rojo serve
    ```

3.  **Run Tests (Pure Logic)**:
    ```bash
    npm test
    ```
    *Runs Vitest on `src/shared` logic.*

## Project Layout

-   `src/shared`: **Pure Logic**. The brain. Edit this for algorithms/data.
-   `src/server`: **Roblox Services**. The body. Edit this for spawning parts/managing state.
-   `src/client`: **Controllers**. The eyes/hands. Edit this for UI/Input.

## Validating the Dungeon Generator

1.  Open `src/shared/algorithms/dungeon-gen.spec.ts`.
2.  Run `npm test`.
3.  Ensure the "Connectivity" test passes (Logic check).
4.  Start Roblox Studio.
5.  Press **Run**.
6.  Look for "DungeonService: Generated 25 rooms" in output.

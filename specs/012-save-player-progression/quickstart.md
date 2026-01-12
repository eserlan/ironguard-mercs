# Quickstart: Player Persistence

How to use the new `PlayerDataService` to save and retrieve player state.

## 1. Accessing Player Data (Server)

Inject `PlayerDataService` to read or modify a player's profile.

```typescript
import { Service } from "@flamework/core";
import { PlayerDataService } from "server/services/PlayerDataService";

@Service()
export class MyService {
    constructor(private readonly playerData: PlayerDataService) {}

    public onPlayerLevelUp(player: Player) {
        // 1. Get the profile
        const profile = this.playerData.getProfile(player);
        if (!profile) return; // Not loaded yet

        // 2. Modify data (API handles immutability/saving internally or provides mutator)
        this.playerData.addXP(player, 100);
    }
}
```

## 2. Using Session Data (Client)

The client receives updates via the `PlayerDataController`.

```typescript
import { Controller } from "@flamework/core";
import { PlayerDataController } from "client/controllers/PlayerDataController";

@Controller()
export class MyHUDController {
    constructor(private readonly playerData: PlayerDataController) {}

    onStart() {
        // Listen for XP changes
        this.playerData.onProfileUpdate.Connect((profile) => {
            print("My Level:", profile.Classes["ashblade"]?.Level);
        });
    }
}
```

## 3. Testing Persistence

1.  **Join the Game**: A new profile is created automatically.
2.  **Check Console**: Look for "Profile loaded for [PlayerName]".
3.  **Gain XP**: Trigger an XP gain event (or use a dev command if added).
4.  **Leave**: Disconnect. Console should say "Profile saved".
5.  **Rejoin**: Verify XP is restored.

import { Service, OnStart } from "@flamework/core";
import { EnemyRegistry } from "shared/domain/enemies/config";
import { Log } from "shared/utils/log";

// Import all enemy data files to ensure they are loaded
import * as Minions from "shared/data/enemies/minions";
import * as Elites from "shared/data/enemies/elites";
import * as Specialists from "shared/data/enemies/specialists";
import * as Bosses from "shared/data/enemies/bosses";

@Service({})
export class EnemyRegistrationService implements OnStart {
    onStart() {
        Log.info("Starting Enemy Registration...");

        const catalogs = [Minions, Elites, Specialists, Bosses];
        let count = 0;

        for (const catalog of catalogs) {
            for (const [_, archetype] of pairs(catalog as unknown as Map<string, unknown>)) {
                if (typeOf(archetype) === "table" && "id" in (archetype as object)) {
                    EnemyRegistry.register(archetype as any);
                    count++;
                }
            }
        }

        Log.info(`Successfully registered ${count} enemy archetypes`);
    }
}

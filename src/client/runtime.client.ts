import { Flamework } from "@flamework/core";

print("[Client] Starting Ironguard Mercs...");

Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/client/components");
Flamework.ignite();

print("[Client] Flamework ignited!");


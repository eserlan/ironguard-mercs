import { Flamework } from "@flamework/core";

print("[Server] Starting Ironguard Mercs...");

Flamework.addPaths("src/server/services");
Flamework.addPaths("src/server/cmpts");
Flamework.ignite();

print("[Server] Flamework ignited!");


import { Log } from "../../shared/utils/log";

/**
 * Plays an ambush cue VFX at the given position.
 * For MVP, this is a simple delay to telegraph the spawn.
 * Future: Add particle effects, sounds, etc.
 */
export async function playAmbushCue(cframe: CFrame): Promise<void> {
    const position = cframe.Position;
    Log.info(`[AmbushVFX] Playing ambush cue at ${position}`);

    // Create visual indicator (placeholder sphere)
    const indicator = new Instance("Part");
    indicator.Name = "AmbushIndicator";
    indicator.Shape = Enum.PartType.Ball;
    indicator.Size = new Vector3(4, 4, 4);
    indicator.Anchored = true;
    indicator.CanCollide = false;
    indicator.Material = Enum.Material.Neon;
    indicator.BrickColor = new BrickColor("Deep orange");
    indicator.Transparency = 0.3;
    indicator.CFrame = cframe;
    indicator.Parent = game.GetService("Workspace");

    // Wait 1.5 seconds (FR-006 spec)
    return new Promise((resolve) => {
        task.delay(1.5, () => {
            indicator.Destroy();
            resolve();
        });
    });
}

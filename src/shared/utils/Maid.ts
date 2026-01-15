export type MaidTask = Instance | RBXScriptConnection | (() => void);

export class Maid {
    private readonly tasks = new Array<MaidTask>();

    public GiveTask(task: MaidTask): void {
        this.tasks.push(task);
    }

    public Destroy(): void {
        for (const task of this.tasks) {
            if (typeIs(task, "RBXScriptConnection")) {
                task.Disconnect();
            } else if (typeIs(task, "Instance")) {
                task.Destroy();
            } else {
                task();
            }
        }
        this.tasks.clear();
    }
}

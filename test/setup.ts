// Polyfill Roblox globals for Node.js tests
global.math = Math as any;

global.print = (...args: any[]) => console.log(...args);
global.warn = (...args: any[]) => console.warn(...args);

global.pairs = (t: object) => Object.entries(t)[Symbol.iterator]();

global.task = {
    wait: (t: number) => new Promise(r => setTimeout(r, t * 1000)),
    delay: (t: number, cb: () => void) => setTimeout(cb, t * 1000),
    spawn: (cb: () => void) => cb(),
    defer: (cb: () => void) => process.nextTick(cb),
} as any;

global.os = {
    time: () => Math.floor(Date.now() / 1000),
    clock: () => Date.now() / 1000,
    date: () => new Date().toISOString(),
} as any;

// Polyfill for roblox-ts Array.size()
if (!Array.prototype.size) {
    Object.defineProperty(Array.prototype, "size", {
        value: function () {
            return this.length;
        },
        writable: true,
        configurable: true,
    });
}

// Polyfill for roblox-ts Array.remove(index)
if (!Array.prototype.remove) {
    Object.defineProperty(Array.prototype, "remove", {
        value: function (index: number) {
            if (index >= 0 && index < this.length) {
                return this.splice(index, 1)[0];
            }
            return undefined;
        },
        writable: true,
        configurable: true,
    });
}
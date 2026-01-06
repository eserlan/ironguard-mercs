// Polyfill Roblox globals for Node.js tests
global.math = Math as any;

global.task = {
    wait: (t: number) => new Promise(r => setTimeout(r, t * 1000)),
    delay: (t: number, cb: () => void) => setTimeout(cb, t * 1000),
    spawn: (cb: () => void) => cb(),
    defer: (cb: () => void) => process.nextTick(cb),
} as any;

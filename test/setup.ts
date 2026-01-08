// Polyfill Roblox globals for Node.js tests
// Luau math.random(m, n) returns inclusive integer between m and n
global.math = {
    ...Math,
    random: (min?: number, max?: number) => {
        if (min === undefined) {
            return Math.random();
        }
        if (max === undefined) {
            return Math.floor(Math.random() * min) + 1;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    min: Math.min,
    max: Math.max,
    floor: Math.floor,
    ceil: Math.ceil,
    abs: Math.abs,
    sqrt: Math.sqrt,
    pow: Math.pow,
} as any;

global.print = (...args: any[]) => console.log(...args);
global.warn = (...args: any[]) => console.warn(...args);

global.tostring = (val: any) => String(val);
global.tonumber = (val: any) => {
    const n = Number(val);
    return isNaN(n) ? undefined : n;
};

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

// Polyfill for Luau string.size() 
if (!(String.prototype as any).size) {
    Object.defineProperty(String.prototype, "size", {
        value: function () {
            return this.length;
        },
        writable: true,
        configurable: true,
    });
}

// Polyfill for Luau string.sub(start, end) - 1-indexed, inclusive
if (!(String.prototype as any).sub) {
    Object.defineProperty(String.prototype, "sub", {
        value: function (start: number, end?: number) {
            // Luau sub() is 1-indexed and inclusive
            const s = start - 1;
            const e = end !== undefined ? end : this.length;
            return this.substring(s, e);
        },
        writable: true,
        configurable: true,
    });
}
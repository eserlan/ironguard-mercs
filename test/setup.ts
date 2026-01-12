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

// Polyfill for Luau string.find(pattern)
if (!(String.prototype as any).find) {
    Object.defineProperty(String.prototype, "find", {
        value: function (pattern: string) {
            const index = this.indexOf(pattern);
            if (index === -1) return [undefined];
            return [index + 1, index + pattern.length];
        },
        writable: true,
        configurable: true,
    });
}

// Polyfill for Roblox Color3
(global as any).Color3 = {
    new: (r: number, g: number, b: number) => ({ R: r, G: g, B: b }),
    fromRGB: (r: number, g: number, b: number) => ({ R: r / 255, G: g / 255, B: b / 255 }),
    fromHSV: (h: number, s: number, v: number) => ({ R: 1, G: 1, B: 1 }), // Dummy
};

// Polyfill for Roblox Instance
class MockInstance {
    public Name: string;
    private _parent: any = undefined;
    public children: any[] = [];

    constructor(public className: string) {
        this.Name = className;
    }

    get Parent() { return this._parent; }
    set Parent(p: any) {
        if (this._parent) {
            this._parent.children = this._parent.children.filter((c: any) => c !== this);
        }
        this._parent = p;
        if (p) {
            p.children.push(this);
        }
    }

    public FindFirstChild(name: string) {
        return this.children.find(c => c.Name === name);
    }

    public FindFirstChildOfClass(className: string) {
        return this.children.find(c => c.className === className);
    }

    public Clone() {
        return new MockInstance(this.className);
    }

    public IsA(className: string) {
        return this.className === className;
    }

    public GetChildren() {
        return this.children;
    }

    public ApplyDescription() { } // Dummy for Humanoid
}

(global as any).Instance = MockInstance;

(global as any).Enum = {
    // Add any required enums here
};
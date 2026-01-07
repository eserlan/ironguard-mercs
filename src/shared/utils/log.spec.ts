import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Log, check } from './log';

describe('Log', () => {
    let spyPrint: ReturnType<typeof vi.spyOn>;
    let spyWarn: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        spyPrint = vi.spyOn(console, 'log').mockImplementation(() => { });
        spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    it('logs info, warn, error', () => {
        Log.info('info');
        expect(spyPrint).toHaveBeenCalled();

        Log.warn('warn');
        expect(spyWarn).toHaveBeenCalled();

        Log.error('error');
        expect(spyWarn).toHaveBeenCalledTimes(2);
    });
});

describe('check', () => {
    it('throws when condition is false', () => {
        expect(() => check(false, 'oops')).toThrow('[ASSERT FAILED] oops');
    });

    it('does not throw when condition is true', () => {
        expect(() => check(true, 'ok')).not.toThrow();
    });
});

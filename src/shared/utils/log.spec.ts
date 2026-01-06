import { describe, it, expect, vi } from 'vitest';
import { Log, assert } from './log';

describe('Log', () => {
    it('logs info, warn, error', () => {
        const spyPrint = vi.spyOn(console, 'log').mockImplementation(() => {});
        const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        
        Log.info('info');
        expect(spyPrint).toHaveBeenCalled();
        
        Log.warn('warn');
        expect(spyWarn).toHaveBeenCalled();
        
        Log.error('error');
        expect(spyWarn).toHaveBeenCalledTimes(2);
        
        spyPrint.mockRestore();
        spyWarn.mockRestore();
    });
});

describe('assert', () => {
    it('throws when condition is false', () => {
        expect(() => assert(false, 'oops')).toThrow('[ASSERT FAILED] oops');
    });

    it('does not throw when condition is true', () => {
        expect(() => assert(true, 'ok')).not.toThrow();
    });
});

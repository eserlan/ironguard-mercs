import { describe, it, expect, vi } from 'vitest';
import { reportError } from './diagnostics';

describe('reportError', () => {
    it('warns about errors', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        reportError('ctx', 'oops');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});

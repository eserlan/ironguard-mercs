import { describe, it, expect } from 'vitest';
import { validateIntent } from './validation';

describe('validateIntent', () => {
    it('accepts recent', () => {
        expect(validateIntent({ timestamp: 100 } as any, 100.5)).toBe(true);
    });
    it('rejects old', () => {
        expect(validateIntent({ timestamp: 100 } as any, 102)).toBe(false);
    });
});

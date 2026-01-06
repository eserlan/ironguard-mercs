import { describe, it, expect } from 'vitest';
import { validateLayout } from './validator';

describe('validateLayout', () => {
    it('passes', () => {
        expect(validateLayout()).toBe(true);
    });
});

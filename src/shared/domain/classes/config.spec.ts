import { describe, it, expect } from 'vitest';
import { ClassRegistry } from './config';
import { ClassRole } from './types';

describe('ClassRegistry', () => {
    it('validates correctly', () => {
        const config = { id: 'c1', name: 'C1', abilityLibrary: ['a1'] } as any;
        expect(ClassRegistry.validate(config)).toBe(true);
        expect(ClassRegistry.validate({ id: '', name: '', abilityLibrary: [] } as any)).toBe(false);
    });

    it('registers and gets', () => {
        const config = { id: 'c2', name: 'C2', abilityLibrary: ['a1'] } as any;
        ClassRegistry.register(config);
        expect(ClassRegistry.get('c2')).toBe(config);
        expect(ClassRegistry.getAll()).toContain(config);
    });

    it('throws on duplicate', () => {
        const config = { id: 'c3', name: 'C3', abilityLibrary: ['a1'] } as any;
        ClassRegistry.register(config);
        expect(() => ClassRegistry.register(config)).toThrow('Duplicate class ID: c3');
    });
});

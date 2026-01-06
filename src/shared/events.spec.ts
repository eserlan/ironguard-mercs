import { describe, it, expect, vi } from 'vitest';
import { SimpleEvent } from './events';

describe('SimpleEvent', () => {
    it('notifies listeners', () => {
        const event = new SimpleEvent<string>();
        const spy = vi.fn();
        event.subscribe(spy);
        event.emit('hello');
        expect(spy).toHaveBeenCalledWith('hello');
    });

    it('unsubscribes', () => {
        const event = new SimpleEvent<string>();
        const spy = vi.fn();
        const unsub = event.subscribe(spy);
        unsub();
        event.emit('hello');
        expect(spy).not.toHaveBeenCalled();
    });
});

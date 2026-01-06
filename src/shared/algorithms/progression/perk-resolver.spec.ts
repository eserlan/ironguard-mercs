import { describe, it, expect } from 'vitest';
import { resolvePerkChoices } from './perk-resolver';

describe('perk-resolver', () => {
	const mockPerks = [
		{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }, { id: 'p4' }
	] as any[];

	it('is deterministic for same seed/user', () => {
		const c1 = resolvePerkChoices(12345, 1, 2, mockPerks);
		const c2 = resolvePerkChoices(12345, 1, 2, mockPerks);
		expect(c1).toEqual(c2);
	});

	it('differs for different users', () => {
		const c1 = resolvePerkChoices(12345, 1, 2, mockPerks);
		const c2 = resolvePerkChoices(12345, 2, 2, mockPerks);
		expect(c1).not.toEqual(c2);
	});
});

import { describe, it, expect } from 'vitest';
import { ROLE_FLOORS } from './role-floors';
import { EnemyRole } from '../../domain/enemies/types';

describe('ROLE_FLOORS', () => {
    it('Assassin floor met when isolated', () => {
        const candidate = { id: 'p1', distance: 10, threatBias: 0, isIsolated: true, isLowHp: false };
        expect(ROLE_FLOORS[EnemyRole.Assassin].isMet(candidate)).toBe(true);
    });

    it('Artillery floor met when distant', () => {
        const candidate = { id: 'p1', distance: 30, threatBias: 0, isIsolated: false, isLowHp: false };
        expect(ROLE_FLOORS[EnemyRole.Artillery].isMet(candidate)).toBe(true);
    });

    it('Tank floor always met', () => {
        const candidate = { id: 'p1', distance: 10, threatBias: 0, isIsolated: false, isLowHp: false };
        expect(ROLE_FLOORS[EnemyRole.Tank].isMet(candidate)).toBe(true);
    });

    it('Controller floor met when not isolated', () => {
        const candidate = { id: 'p1', distance: 10, threatBias: 0, isIsolated: false, isLowHp: false };
        expect(ROLE_FLOORS[EnemyRole.Controller].isMet(candidate)).toBe(true);
    });

    it('Support floor always met', () => {
        const candidate = { id: 'p1', distance: 10, threatBias: 0, isIsolated: false, isLowHp: false };
        expect(ROLE_FLOORS[EnemyRole.Support].isMet(candidate)).toBe(true);
    });

    it('Swarm floor always met', () => {
        const candidate = { id: 'p1', distance: 10, threatBias: 0, isIsolated: false, isLowHp: false };
        expect(ROLE_FLOORS[EnemyRole.Swarm].isMet(candidate)).toBe(true);
    });
});
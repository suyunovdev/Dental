import { describe, it, expect } from 'vitest';
import { tashkentDayRange, toTashkentParts } from './time.js';

describe('time.ts (Toshkent vaqti utilitlari)', () => {
  describe('tashkentDayRange', () => {
    it('Toshkent kuni uchun to\'g\'ri UTC chegaralarni hisoblashi kerak', () => {
      const range = tashkentDayRange('2026-12-17');

      // Toshkent 2026-12-17 00:00:00+05 = UTC 2026-12-16 19:00:00Z
      expect(range.from.toISOString()).toBe('2026-12-16T19:00:00.000Z');

      // Toshkent 2026-12-18 00:00:00+05 = UTC 2026-12-17 19:00:00Z
      expect(range.to.toISOString()).toBe('2026-12-17T19:00:00.000Z');
    });

    it('Yil o\'tishi (31-dekabr) uchun to\'g\'ri ishlashi kerak', () => {
      const range = tashkentDayRange('2026-12-31');
      expect(range.from.toISOString()).toBe('2026-12-30T19:00:00.000Z');
      expect(range.to.toISOString()).toBe('2026-12-31T19:00:00.000Z');
    });

    it('Noto\'g\'ri sana formatida xato berishi kerak', () => {
      expect(() => tashkentDayRange('not-a-date')).toThrowError(/Noto'g'ri sana formati/);
    });
  });

  describe('toTashkentParts', () => {
    it('UTC vaqtni Toshkent sanasi, hafta kuni va daqiqasiga aylantirishi kerak', () => {
      // 2026-12-03T05:00:00.000Z -> Toshkentda 10:00 (Payshanba, 4-kun)
      const parts = toTashkentParts('2026-12-03T05:00:00.000Z');
      expect(parts.date).toBe('2026-12-03');
      expect(parts.weekday).toBe(4);
      expect(parts.minuteOfDay).toBe(600); // 10 * 60
    });

    it('Toshkent vaqti bilan tunda (00:30) bo\'lgan vaqtni to\'g\'ri aniqlashi kerak', () => {
      // UTC 2026-12-02T19:30:00.000Z -> Toshkentda 2026-12-03 00:30
      const parts = toTashkentParts('2026-12-02T19:30:00.000Z');
      expect(parts.date).toBe('2026-12-03');
      expect(parts.weekday).toBe(4);
      expect(parts.minuteOfDay).toBe(30);
    });

    it('Toshkent vaqti bilan kechqurun (23:45) bo\'lgan vaqtni to\'g\'ri aniqlashi kerak', () => {
      // UTC 2026-12-03T18:45:00.000Z -> Toshkentda 2026-12-03 23:45
      const parts = toTashkentParts('2026-12-03T18:45:00.000Z');
      expect(parts.date).toBe('2026-12-03');
      expect(parts.weekday).toBe(4);
      expect(parts.minuteOfDay).toBe(1425); // 23 * 60 + 45
    });

    it('Yakshanba kunini weekday = 7 sifatida qaytarishi kerak', () => {
      // 2026-12-06 yakshanba: UTC 2026-12-06T07:00:00.000Z -> Toshkentda 12:00
      const parts = toTashkentParts('2026-12-06T07:00:00.000Z');
      expect(parts.date).toBe('2026-12-06');
      expect(parts.weekday).toBe(7);
      expect(parts.minuteOfDay).toBe(720); // 12 * 60
    });
  });
});

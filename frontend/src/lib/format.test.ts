import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatPhone,
  formatTime,
  getAge,
  normalizePhone,
} from './format';

describe('formatMoney', () => {
  it('pul miqdorini mingliklarga ajratib formatlaydi', () => {
    expect(formatMoney(350000)).toBe("350 000 so'm");
    expect(formatMoney(1000000)).toBe("1 000 000 so'm");
    expect(formatMoney(5000)).toBe("5 000 so'm");
    expect(formatMoney(500)).toBe("500 so'm");
  });

  it('nol va manfiy summalarni to\'g\'ri formatlaydi', () => {
    expect(formatMoney(0)).toBe("0 so'm");
    expect(formatMoney(-50000)).toBe("-50 000 so'm");
  });

  it('noto\'g\'ri qiymatlarda xavfsiz nol qaytaradi', () => {
    expect(formatMoney(NaN)).toBe("0 so'm");
  });
});

describe('normalizePhone', () => {
  it('9 ta raqam kiritilganda +998 prefiksini qo\'shadi', () => {
    expect(normalizePhone('901234567')).toBe('+998901234567');
    expect(normalizePhone('90 123 45 67')).toBe('+998901234567');
  });

  it('turli formatdagi 12 ta raqamli O\'zbekiston raqamlarini tozalaydi', () => {
    expect(normalizePhone('998901234567')).toBe('+998901234567');
    expect(normalizePhone('+998901234567')).toBe('+998901234567');
    expect(normalizePhone('+998 (90) 123-45-67')).toBe('+998901234567');
    expect(normalizePhone('+998 90 123 45 67')).toBe('+998901234567');
  });

  it('noto\'g\'ri uzunlikdagi yoki boshqa davlat raqamlarida xato beradi', () => {
    expect(() => normalizePhone('')).toThrow();
    expect(() => normalizePhone('12345')).toThrow();
    expect(() => normalizePhone('9989012345678')).toThrow();
    expect(() => normalizePhone('+79991234567')).toThrow(); // 11 ta raqam
  });
});

describe('formatPhone', () => {
  it('telefon raqamini +998 XX XXX XX XX ko\'rinishiga keltiradi', () => {
    expect(formatPhone('+998901234567')).toBe('+998 90 123 45 67');
    expect(formatPhone('901234567')).toBe('+998 90 123 45 67');
    expect(formatPhone('998931112233')).toBe('+998 93 111 22 33');
  });

  it('bo\'sh yoki noto\'g\'ri qiymat kelsa xavfsiz ishlaydi', () => {
    expect(formatPhone('')).toBe('');
    expect(formatPhone('invalid')).toBe('invalid');
  });
});

describe('Vaqt formatlash (Toshkent vaqti UTC+5)', () => {
  // 2026-12-03T05:30:00.000Z -> Toshkentda 2026-12-03 10:30
  const isoUtcMorning = '2026-12-03T05:30:00.000Z';

  // 2026-12-03T20:00:00.000Z -> Toshkentda 2026-12-04 01:00 (kun almashadi)
  const isoUtcNight = '2026-12-03T20:00:00.000Z';

  it('formatDate Toshkent sanasini DD.MM.YYYY formatida qaytaradi', () => {
    expect(formatDate(isoUtcMorning)).toBe('03.12.2026');
    expect(formatDate(isoUtcNight)).toBe('04.12.2026');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('formatDateTime Toshkent sanasi va vaqtini qaytaradi', () => {
    expect(formatDateTime(isoUtcMorning)).toBe('03.12.2026 10:30');
    expect(formatDateTime(isoUtcNight)).toBe('04.12.2026 01:00');
    expect(formatDateTime(null)).toBe('');
  });

  it('formatTime faqat Toshkent vaqtini HH:mm qaytaradi', () => {
    expect(formatTime(isoUtcMorning)).toBe('10:30');
    expect(formatTime(isoUtcNight)).toBe('01:00');
    expect(formatTime(null)).toBe('');
  });
});

describe('getAge', () => {
  it('tug\'ilgan sanadan yoshni hisoblaydi', () => {
    // 1990-yil 1-yanvarda tug'ilgan odamning 2026-yilda yoshi 36 da bo'ladi
    const age = getAge('1990-01-01');
    expect(typeof age).toBe('number');
    expect(age).toBeGreaterThanOrEqual(36);
  });

  it('bo\'sh yoki noto\'g\'ri sanada null qaytaradi', () => {
    expect(getAge(null)).toBeNull();
    expect(getAge(undefined)).toBeNull();
    expect(getAge('not-a-date')).toBeNull();
  });
});

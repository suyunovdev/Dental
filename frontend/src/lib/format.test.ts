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

  it('chegaraviy test: nol va manfiy summalarni (qaytarish / refund) to\'g\'ri formatlaydi', () => {
    expect(formatMoney(0)).toBe("0 so'm");
    expect(formatMoney(-50000)).toBe("-50 000 so'm");
    expect(formatMoney(-1500000)).toBe("-1 500 000 so'm");
  });

  it('noto\'g\'ri qiymatlarda xavfsiz nol qaytaradi', () => {
    expect(formatMoney(NaN)).toBe("0 so'm");
  });
});

describe('normalizePhone (TZ T-18 dagi 8 ta qat\'iy holat)', () => {
  // 1. Probel bilan 9 ta raqam
  it('1. "90 123 45 67" -> "+998901234567"', () => {
    expect(normalizePhone('90 123 45 67')).toBe('+998901234567');
  });

  // 2. Probelsiz 9 ta raqam
  it('2. "901234567" -> "+998901234567"', () => {
    expect(normalizePhone('901234567')).toBe('+998901234567');
  });

  // 3. 998 bilan 12 ta raqam
  it('3. "998901234567" -> "+998901234567"', () => {
    expect(normalizePhone('998901234567')).toBe('+998901234567');
  });

  // 4. Qavslar va chiziqchalar bilan +998 formati
  it('4. "+998 (90) 123-45-67" -> "+998901234567"', () => {
    expect(normalizePhone('+998 (90) 123-45-67')).toBe('+998901234567');
  });

  // 5. Bo'sh qiymat -> null
  it('5. bo\'sh yoki probelli qiymat -> null', () => {
    expect(normalizePhone('')).toBeNull();
    expect(normalizePhone('   ')).toBeNull();
    expect(normalizePhone(null)).toBeNull();
    expect(normalizePhone(undefined)).toBeNull();
  });

  // 6. Harf qatnashgan xato kiritish -> null (jimgina tashlab yuborilmaydi)
  it('6. harfli xato raqam ("90abc1234567", "telefon") -> null', () => {
    expect(normalizePhone('90abc1234567')).toBeNull();
    expect(normalizePhone('telefon')).toBeNull();
    expect(normalizePhone('+99890123456a')).toBeNull();
  });

  // 7. 8 ta raqam (kam raqam) -> null
  it('7. 8 ta raqam ("90123456") -> null', () => {
    expect(normalizePhone('90123456')).toBeNull();
  });

  // 8. 13 ta raqam (ortiqcha raqam) -> null
  it('8. 13 ta raqam ("9989012345678") -> null', () => {
    expect(normalizePhone('9989012345678')).toBeNull();
  });

  it('boshqa davlat kodi yoki xato formati -> null', () => {
    expect(normalizePhone('+79991234567')).toBeNull();
    expect(normalizePhone('12345')).toBeNull();
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
    expect(formatPhone(null)).toBe('');
    expect(formatPhone('90abc1234567')).toBe('90abc1234567');
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
    expect(formatDateTime(undefined)).toBe('');
  });

  it('formatTime faqat Toshkent vaqtini HH:mm qaytaradi', () => {
    expect(formatTime(isoUtcMorning)).toBe('10:30');
    expect(formatTime(isoUtcNight)).toBe('01:00');
    expect(formatTime(null)).toBe('');
    expect(formatTime(undefined)).toBe('');
  });
});

describe('getAge (chegaraviy testlar)', () => {
  const currentDate = '2026-11-25T12:00:00.000Z'; // 2026-yil 25-noyabr

  it('standart yosh hisoblash', () => {
    expect(getAge('1990-01-01', currentDate)).toBe(36);
  });

  it('bugun tug\'ilgan kun: aynan bugun yosh to\'lgan bo\'lsa', () => {
    expect(getAge('2000-11-25', currentDate)).toBe(26);
  });

  it('erta tug\'ilgan kun: tug\'ilgan kun hali kelmagan bo\'lsa', () => {
    expect(getAge('2000-11-26', currentDate)).toBe(25);
  });

  it('kecha tug\'ilgan kun: tug\'ilgan kun kecha o\'tgan bo\'lsa', () => {
    expect(getAge('2000-11-24', currentDate)).toBe(26);
  });

  it('29-fevralda tug\'ilgan (kabisa yili): kabisa bo\'lmagan yilda to\'g\'ri hisoblanadi', () => {
    // 2004-yil 29-fevralda tug'ilgan, 2026-yil 25-noyabrda yoshi 22 da
    expect(getAge('2004-02-29', currentDate)).toBe(22);
    // 2004-yil 29-fevralda tug'ilgan, 2026-yil 28-fevralda hali to'lmagan (21 da)
    expect(getAge('2004-02-29', '2026-02-28T12:00:00.000Z')).toBe(21);
  });

  it('bo\'sh yoki noto\'g\'ri sanalarda null qaytaradi', () => {
    expect(getAge(null)).toBeNull();
    expect(getAge(undefined)).toBeNull();
    expect(getAge('')).toBeNull();
    expect(getAge('not-a-date')).toBeNull();
  });
});

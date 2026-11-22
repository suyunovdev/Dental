/**
 * Toshkent vaqt zonasi utilitlari (Asia/Tashkent = UTC+5)
 * O'zbekistonda yozgi vaqt yo'q, ofset doimiy +05:00.
 */

const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000;

export interface TashkentParts {
  date: string; // "YYYY-MM-DD"
  weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 = Dushanba ... 7 = Yakshanba
  minuteOfDay: number; // 0..1439 (kun boshidan daqiqalar)
}

/**
 * Berilgan Toshkent kuni ("YYYY-MM-DD") uchun UTC oraliqni qaytaradi.
 * Masalan: '2026-12-17' -> {
 *   from: 2026-12-16T19:00:00.000Z,
 *   to:   2026-12-17T19:00:00.000Z
 * }
 */
export function tashkentDayRange(dateStr: string): { from: Date; to: Date } {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Noto'g'ri sana formati: ${dateStr}. Kutilgan format: YYYY-MM-DD`);
  }

  const [year, month, day] = parts;
  const fromMs = Date.UTC(year, month - 1, day, 0, 0, 0, 0) - TASHKENT_OFFSET_MS;
  const toMs = Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0) - TASHKENT_OFFSET_MS;

  return {
    from: new Date(fromMs),
    to: new Date(toMs),
  };
}

/**
 * UTC Date yoki ISO string'ni Toshkent vaqtidagi qismlarga (sana, hafta kuni, daqiqa) ajratadi.
 */
export function toTashkentParts(dateInput: Date | string): TashkentParts {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    throw new Error(`Noto'g'ri vaqt qiymati: ${String(dateInput)}`);
  }

  const tashkentMs = date.getTime() + TASHKENT_OFFSET_MS;
  const tDate = new Date(tashkentMs);

  const year = tDate.getUTCFullYear();
  const month = String(tDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(tDate.getUTCDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  const dayOfWeek = tDate.getUTCDay(); // 0 = Yakshanba, 1 = Dushanba, ..., 6 = Shanba
  const weekday = (dayOfWeek === 0 ? 7 : dayOfWeek) as 1 | 2 | 3 | 4 | 5 | 6 | 7;

  const minuteOfDay = tDate.getUTCHours() * 60 + tDate.getUTCMinutes();

  return {
    date: dateString,
    weekday,
    minuteOfDay,
  };
}

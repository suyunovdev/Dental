/**
 * Dental platformasi (F-2) — Qiymatlarni formatlash utilitlari
 * Arxitektura talablari:
 * - Pul: butun so'm, minglar ajratilgan, "so'm" qo'shimchasi bilan (arxitektura.md 2-bo'lim Q5)
 * - Telefon: +998XXXXXXXXX (arxitektura.md 7.6-bo'lim)
 * - Vaqt: Asia/Tashkent (UTC+5) (arxitektura.md 7.7-bo'lim)
 */

export const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000;

/**
 * Pul miqdorini formatlaydi: 350000 -> "350 000 so'm"
 */
export function formatMoney(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return "0 so'm";
  }
  const rounded = Math.round(amount);
  const formatted = rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} so'm`;
}

/**
 * Telefon raqamini standart formatga keltiradi (+998XXXXXXXXX)
 * Qoidalar (arxitektura.md 7.6):
 * - 9 ta raqam bo'lsa (masalan: 901234567) -> +998901234567
 * - 12 ta raqam bo'lsa va 998 bilan boshlansa -> +998901234567
 * - Har qanday qavs, bo'sh joy, chiziqchalar olib tashlanadi
 * - Boshqa uzunlik yoki xato format bo'lsa xato beradi
 */
export function normalizePhone(raw: string): string {
  if (!raw || typeof raw !== 'string') {
    throw new Error("Telefon raqami kiritilishi shart");
  }

  // Faqat raqamlarni ajratib olamiz
  const digits = raw.replace(/\D/g, '');

  if (digits.length === 9) {
    return `+998${digits}`;
  }

  if (digits.length === 12) {
    if (digits.startsWith('998')) {
      return `+${digits}`;
    }
    throw new Error("O'zbekiston kodi (+998) bilan boshlanishi kerak");
  }

  throw new Error("Telefon raqami 9 yoki 12 ta raqamdan iborat bo'lishi kerak");
}

/**
 * Telefon raqamini ko'rsatish uchun chiroyli formatga keltiradi:
 * "+998901234567" -> "+998 90 123 45 67"
 */
export function formatPhone(raw: string): string {
  if (!raw) return '';
  try {
    const normalized = normalizePhone(raw);
    const code = normalized.slice(4, 6);
    const p1 = normalized.slice(6, 9);
    const p2 = normalized.slice(9, 11);
    const p3 = normalized.slice(11, 13);
    return `+998 ${code} ${p1} ${p2} ${p3}`;
  } catch {
    return raw;
  }
}

/**
 * Berilgan sanani Toshkent vaqtidagi qismlarga ajratadi (UTC+5)
 */
function getTashkentParts(dateInput: Date | string | number) {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number'
    ? new Date(dateInput)
    : dateInput;

  if (isNaN(d.getTime())) {
    throw new Error(`Noto'g'ri sana: ${String(dateInput)}`);
  }

  const tDate = new Date(d.getTime() + TASHKENT_OFFSET_MS);
  return {
    year: tDate.getUTCFullYear(),
    month: String(tDate.getUTCMonth() + 1).padStart(2, '0'),
    day: String(tDate.getUTCDate()).padStart(2, '0'),
    hours: String(tDate.getUTCHours()).padStart(2, '0'),
    minutes: String(tDate.getUTCMinutes()).padStart(2, '0'),
    seconds: String(tDate.getUTCSeconds()).padStart(2, '0'),
  };
}

/**
 * Sanani "DD.MM.YYYY" formatida ko'rsatadi (Toshkent vaqti)
 * Masalan: "2026-11-23T05:00:00Z" -> "23.11.2026"
 */
export function formatDate(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '';
  try {
    const { day, month, year } = getTashkentParts(dateInput);
    return `${day}.${month}.${year}`;
  } catch {
    return '';
  }
}

/**
 * Sanani va vaqtni "DD.MM.YYYY HH:mm" formatida ko'rsatadi (Toshkent vaqti)
 * Masalan: "2026-11-23T05:30:00Z" -> "23.11.2026 10:30"
 */
export function formatDateTime(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '';
  try {
    const { day, month, year, hours, minutes } = getTashkentParts(dateInput);
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch {
    return '';
  }
}

/**
 * Faqat vaqtni "HH:mm" formatida ko'rsatadi (Toshkent vaqti)
 * Masalan: "2026-11-23T05:30:00Z" -> "10:30"
 */
export function formatTime(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '';
  try {
    const { hours, minutes } = getTashkentParts(dateInput);
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}

/**
 * Tug'ilgan sanadan yoshni hisoblaydi (Toshkent vaqti bo'yicha)
 * Agar sana berilmagan yoki noto'g'ri bo'lsa null qaytaradi
 */
export function getAge(birthDateInput: Date | string | number | null | undefined): number | null {
  if (!birthDateInput) return null;
  try {
    const d = typeof birthDateInput === 'string' || typeof birthDateInput === 'number'
      ? new Date(birthDateInput)
      : birthDateInput;

    if (isNaN(d.getTime())) return null;

    const nowTashkent = new Date(Date.now() + TASHKENT_OFFSET_MS);
    const birthTashkent = new Date(d.getTime() + TASHKENT_OFFSET_MS);

    let age = nowTashkent.getUTCFullYear() - birthTashkent.getUTCFullYear();
    const monthDiff = nowTashkent.getUTCMonth() - birthTashkent.getUTCMonth();

    if (monthDiff < 0 || (monthDiff === 0 && nowTashkent.getUTCDate() < birthTashkent.getUTCDate())) {
      age--;
    }

    return age >= 0 ? age : 0;
  } catch {
    return null;
  }
}

/**
 * Dental platformasi (F-2) — Qiymatlarni formatlash utilitlari
 * Arxitektura talablari:
 * - Pul: butun so'm, minglar ajratilgan, "so'm" qo'shimchasi bilan (arxitektura.md 2-bo'lim Q5)
 * - Telefon: +998XXXXXXXXX (arxitektura.md 7.6-bo'lim, TZ T-18)
 * - Vaqt: Asia/Tashkent (UTC+5) (arxitektura.md 7.7-bo'lim)
 */

export const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000;

/**
 * Pul miqdorini formatlaydi: 350000 -> "350 000 so'm"
 * Nol va manfiy summalarni to'g'ri ko'rsatadi:
 * 0 -> "0 so'm"
 * -50000 -> "-50 000 so'm"
 */
export function formatMoney(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return "0 so'm";
  }
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();
  const formattedAbs = absStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${isNegative ? '-' : ''}${formattedAbs} so'm`;
}

/**
 * Telefon raqamini standart formatga keltiradi (+998XXXXXXXXX)
 * Backend (TZ T-18) bilan 100% bir xil qoidada ishlaydi:
 * - To'g'ri kiritilsa: "+998XXXXXXXXX"
 * - Noto'g'ri kiritilsa (harflar bo'lsa, noto'g'ri uzunlik, bo'sh): null
 *
 * Qoidalar (arxitektura.md 7.6 va TZ T-18):
 * - 9 ta raqam bo'lsa (masalan: "90 123 45 67") -> "+998901234567"
 * - 12 ta raqam bo'lsa va 998 bilan boshlansa -> "+998901234567"
 * - Harf yoki taqiqlangan belgilar bo'lsa (masalan: "90abc1234567") -> null (jimgina tashlab yuborilmaydi)
 * - Bo'sh qiymat -> null
 * - 8 yoki 13 ta raqam -> null
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  // Raqam, probel, qavslar, chiziqcha va boshidagi '+' dan boshqa har qanday belgi (harf, belgi) bo'lsa - xato
  // Masalan: "90abc1234567" -> darhol null
  if (/[^0-9\s()\-+]/.test(trimmed)) {
    return null;
  }

  // '+' faqat eng boshida bo'lishi mumkin
  const plusIndex = trimmed.indexOf('+');
  if (plusIndex > 0 || (plusIndex === 0 && trimmed.indexOf('+', 1) !== -1)) {
    return null;
  }

  // Faqat raqamlarni ajratib olamiz
  const digits = trimmed.replace(/\D/g, '');

  if (digits.length === 9) {
    return `+998${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('998')) {
    return `+${digits}`;
  }

  return null;
}

/**
 * Telefon raqamini ko'rsatish uchun chiroyli formatga keltiradi:
 * "+998901234567" -> "+998 90 123 45 67"
 * Agar raqam formati noto'g'ri bo'lsa yoki bo'sh bo'lsa, xavfsiz qaytaradi
 */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return '';
  const normalized = normalizePhone(raw);
  if (!normalized) return String(raw);

  const code = normalized.slice(4, 6);
  const p1 = normalized.slice(6, 9);
  const p2 = normalized.slice(9, 11);
  const p3 = normalized.slice(11, 13);
  return `+998 ${code} ${p1} ${p2} ${p3}`;
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
 * - 29-fevral kabisa yilida tug'ilganlarni to'g'ri hisoblaydi
 * - Bugun tug'ilgan kun bo'lsa, to'liq yoshni beradi
 * - Agar sana berilmagan yoki noto'g'ri bo'lsa null qaytaradi
 *
 * @param birthDateInput Bemorning tug'ilgan sanasi
 * @param currentDateInput Hozirgi sana (testlar uchun ixtiyoriy, berilmasa hozirgi vaqt olinadi)
 */
export function getAge(
  birthDateInput: Date | string | number | null | undefined,
  currentDateInput?: Date | string | number
): number | null {
  if (!birthDateInput) return null;
  try {
    const birthDate = typeof birthDateInput === 'string' || typeof birthDateInput === 'number'
      ? new Date(birthDateInput)
      : birthDateInput;

    if (isNaN(birthDate.getTime())) return null;

    const currentBase = currentDateInput !== undefined
      ? (typeof currentDateInput === 'string' || typeof currentDateInput === 'number' ? new Date(currentDateInput) : currentDateInput)
      : new Date();

    if (isNaN(currentBase.getTime())) return null;

    const nowTashkent = new Date(currentBase.getTime() + TASHKENT_OFFSET_MS);
    const birthTashkent = new Date(birthDate.getTime() + TASHKENT_OFFSET_MS);

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

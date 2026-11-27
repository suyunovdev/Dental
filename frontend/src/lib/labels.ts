/**
 * Dental platformasi (F-2) — Statuslar, rollar va turlar uchun o'zbekcha nomlar va ranglar
 * Arxitektura talablari:
 * - Foydalanuvchi ko'radigan barcha matnlar — o'zbekcha (lotin yozuvida) (arxitektura.md 12-bo'lim)
 * - Enum qiymatlari: arxitektura.md 6.1-bo'lim va api.md 3-bo'lim bo'yicha
 * - Dizayn tokenlari va ranglar: docs/dizayn/tokenlar.md (T-12, PR #18) bo'yicha
 */

export type Role = 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR' | 'CASHIER';
export type Gender = 'MALE' | 'FEMALE';
export type AppointmentStatus =
  | 'SCHEDULED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';
export type VisitStatus = 'OPEN' | 'COMPLETED';
export type ToothStatus =
  | 'HEALTHY'
  | 'CARIES'
  | 'FILLED'
  | 'PULPITIS'
  | 'PERIODONTITIS'
  | 'ROOT_ONLY'
  | 'CROWN'
  | 'IMPLANT'
  | 'MISSING';
export type PlanStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type PlanItemStatus = 'PLANNED' | 'DONE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';
export type PaymentType = 'PAYMENT' | 'REFUND';
export type FileKind = 'XRAY' | 'PHOTO' | 'DOCUMENT';

export interface StatusMeta {
  label: string;
  color: string; // Asosiy/matn rangi (hex)
  textColor: string;
  bgColor: string;
  borderColor: string;
  badgeStatus?: 'default' | 'success' | 'processing' | 'error' | 'warning';
}

export interface ToothStatusMeta extends StatusMeta {
  code: string;
}

export interface RoleMeta extends StatusMeta {
  description: string;
}

/**
 * 3.1 Qabul holatlari (AppointmentStatus)
 * Manba: docs/dizayn/tokenlar.md 3.1-bo'lim
 */
export const APPOINTMENT_STATUS_MAP: Record<AppointmentStatus, StatusMeta> = {
  SCHEDULED: {
    label: 'Yozilgan',
    color: '#0369A1',
    textColor: '#0369A1',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    badgeStatus: 'processing',
  },
  ARRIVED: {
    label: 'Keldi (kutmoqda)',
    color: '#B45309',
    textColor: '#B45309',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    badgeStatus: 'warning',
  },
  IN_PROGRESS: {
    label: 'Qabulda',
    color: '#0F766E',
    textColor: '#0F766E',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    badgeStatus: 'processing',
  },
  COMPLETED: {
    label: 'Yakunlandi',
    color: '#15803D',
    textColor: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    badgeStatus: 'success',
  },
  CANCELLED: {
    label: 'Bekor qilindi',
    color: '#4B5563',
    textColor: '#4B5563',
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    badgeStatus: 'default',
  },
  NO_SHOW: {
    label: 'Kelmadi',
    color: '#B91C1C',
    textColor: '#B91C1C',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    badgeStatus: 'error',
  },
};

/**
 * 3.2 Tish holatlari (ToothStatus) — Harf kodi va FDI xalqaro standart qisqartmalari
 * Manba: docs/dizayn/tokenlar.md 3.2-bo'lim
 * Eslatma: HEALTHY uchun faqat raqam ko'rinadi (harf kodi '—')
 */
export const TOOTH_STATUS_MAP: Record<ToothStatus, ToothStatusMeta> = {
  HEALTHY: {
    label: "Sog'lom",
    code: '—',
    color: '#4B5563',
    textColor: '#4B5563',
    bgColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  CARIES: {
    label: 'Karies',
    code: 'C',
    color: '#B45309',
    textColor: '#B45309',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  FILLED: {
    label: 'Plomba',
    code: 'Pl',
    color: '#0369A1',
    textColor: '#0369A1',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  PULPITIS: {
    label: 'Pulpit',
    code: 'P',
    color: '#C2410C',
    textColor: '#C2410C',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  PERIODONTITIS: {
    label: 'Periodontit',
    code: 'Pt',
    color: '#B91C1C',
    textColor: '#B91C1C',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  ROOT_ONLY: {
    label: 'Ildiz qolgan',
    code: 'R',
    color: '#6D28D9',
    textColor: '#6D28D9',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  CROWN: {
    label: 'Toj (koronka)',
    code: 'K',
    color: '#0F766E',
    textColor: '#0F766E',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
  },
  IMPLANT: {
    label: 'Implant',
    code: 'I',
    color: '#3730A3',
    textColor: '#3730A3',
    bgColor: '#EEF2FF',
    borderColor: '#A5B4FC',
  },
  MISSING: {
    label: "Yo'q",
    code: '0',
    color: '#4B5563',
    textColor: '#4B5563',
    bgColor: '#E5E7EB',
    borderColor: '#9CA3AF',
  },
};

/**
 * 3.4 Tashrif holatlari (VisitStatus)
 * Manba: docs/dizayn/tokenlar.md 3.4-bo'lim
 */
export const VISIT_STATUS_MAP: Record<VisitStatus, StatusMeta> = {
  OPEN: {
    label: 'Ochiq',
    color: '#0369A1',
    textColor: '#0369A1',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    badgeStatus: 'processing',
  },
  COMPLETED: {
    label: 'Yakunlangan',
    color: '#15803D',
    textColor: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    badgeStatus: 'success',
  },
};

/**
 * 3.4 Davolash rejasi holatlari (PlanStatus)
 * Manba: docs/dizayn/tokenlar.md 3.4-bo'lim
 */
export const PLAN_STATUS_MAP: Record<PlanStatus, StatusMeta> = {
  ACTIVE: {
    label: 'Faol',
    color: '#0F766E',
    textColor: '#0F766E',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    badgeStatus: 'processing',
  },
  COMPLETED: {
    label: 'Yakunlangan',
    color: '#15803D',
    textColor: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    badgeStatus: 'success',
  },
  CANCELLED: {
    label: 'Bekor qilingan',
    color: '#4B5563',
    textColor: '#4B5563',
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    badgeStatus: 'default',
  },
};

/**
 * 3.4 Davolash rejasi bosqichlari (PlanItemStatus)
 * Manba: docs/dizayn/tokenlar.md 3.4-bo'lim
 */
export const PLAN_ITEM_STATUS_MAP: Record<PlanItemStatus, StatusMeta> = {
  PLANNED: {
    label: 'Rejalashtirilgan',
    color: '#1D4ED8',
    textColor: '#1D4ED8',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    badgeStatus: 'processing',
  },
  DONE: {
    label: 'Bajarildi',
    color: '#15803D',
    textColor: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    badgeStatus: 'success',
  },
  CANCELLED: {
    label: 'Bekor qilindi',
    color: '#4B5563',
    textColor: '#4B5563',
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    badgeStatus: 'default',
  },
};

/**
 * 3.3 To'lov usullari (PaymentMethod)
 * Manba: docs/dizayn/tokenlar.md 3.3-bo'lim
 */
export const PAYMENT_METHOD_MAP: Record<PaymentMethod, StatusMeta> = {
  CASH: {
    label: 'Naqd',
    color: '#15803D',
    textColor: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  CARD: {
    label: 'Karta / Terminal',
    color: '#1D4ED8',
    textColor: '#1D4ED8',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  TRANSFER: {
    label: "O'tkazma (Click / Payme)",
    color: '#6D28D9',
    textColor: '#6D28D9',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
};

/**
 * 3.3 To'lov turlari (PaymentType)
 * Manba: docs/dizayn/tokenlar.md 3.3-bo'lim
 */
export const PAYMENT_TYPE_MAP: Record<PaymentType, StatusMeta> = {
  PAYMENT: {
    label: "To'lov",
    color: '#15803D',
    textColor: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    badgeStatus: 'success',
  },
  REFUND: {
    label: 'Qaytarish (Refund)',
    color: '#B91C1C',
    textColor: '#B91C1C',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    badgeStatus: 'error',
  },
};

/**
 * Tizim rollari (Role)
 * Semantik va kontrast mezonlariga mos ranglar bilan
 */
export const ROLE_MAP: Record<Role, RoleMeta> = {
  ADMIN: {
    label: 'Administrator (Rahbar)',
    description: "Barcha bo'limlarga to'liq kirish huquqi",
    color: '#B91C1C',
    textColor: '#B91C1C',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  RECEPTIONIST: {
    label: 'Registrator',
    description: "Bemorlar, qabul taqvimi va navbatni boshqarish",
    color: '#0369A1',
    textColor: '#0369A1',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  DOCTOR: {
    label: 'Shifokor',
    description: "Tibbiy karta, tashriflar va davolash rejalari",
    color: '#0F766E',
    textColor: '#0F766E',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
  },
  CASHIER: {
    label: 'Kassir',
    description: "Kassa, to'lovlarni qabul qilish va chek chiqarish",
    color: '#15803D',
    textColor: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
};

/**
 * 4. Shifokorlar palitrasi (10 ta rang)
 * Manba: docs/dizayn/tokenlar.md 4-bo'lim
 */
export interface DoctorColorToken {
  name: string;
  color: string;
  cardBg: string;
}

export const DOCTOR_PALETTE: DoctorColorToken[] = [
  { name: 'Zumrad', color: '#0F766E', cardBg: '#CCFBF1' },
  { name: 'Ko\'k', color: '#1D4ED8', cardBg: '#DBEAFE' },
  { name: 'Yashil', color: '#2F855A', cardBg: '#DCFCE7' },
  { name: 'Binafsha', color: '#6D28D9', cardBg: '#EDE9FE' },
  { name: 'Siyohrang', color: '#4338CA', cardBg: '#E0E7FF' },
  { name: 'Okean', color: '#0E7490', cardBg: '#CFFAFE' },
  { name: 'Qirmizi', color: '#BE123C', cardBg: '#FFE4E6' },
  { name: 'Oltin-jigarrang', color: '#B45309', cardBg: '#FEF3C7' },
  { name: 'Olxo\'ri', color: '#A21CAF', cardBg: '#FAE8FF' },
  { name: 'To\'q shifer', color: '#334155', cardBg: '#E2E8F0' },
];

/**
 * Jins (Gender)
 */
export const GENDER_MAP: Record<Gender, string> = {
  MALE: 'Erkak',
  FEMALE: 'Ayol',
};

/**
 * Bemor fayllari turlari (FileKind)
 */
export const FILE_KIND_MAP: Record<FileKind, { label: string }> = {
  XRAY: {
    label: 'Rentgen surati',
  },
  PHOTO: {
    label: 'Fotosurat',
  },
  DOCUMENT: {
    label: 'Hujjat',
  },
};

/**
 * Dental platformasi (F-2) — Statuslar, rollar va turlar uchun o'zbekcha nomlar va ranglar
 * Arxitektura talablari:
 * - Foydalanuvchi ko'radigan barcha matnlar — o'zbekcha (lotin yozuvida) (arxitektura.md 12-bo'lim)
 * - Enum qiymatlari: arxitektura.md 6.1-bo'lim va api.md 3-bo'lim bo'yicha
 * - Ranglar vaqtinchalik AntD ranglari (Sanjarning UI kit tokenlari kelgach yangilanadi)
 */

export type Role = 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR' | 'CASHIER';
export type Gender = 'MALE' | 'FEMALE';
export type AppointmentStatus = 'SCHEDULED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
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
  color: string;
  badgeStatus?: 'default' | 'success' | 'processing' | 'error' | 'warning';
}

export interface ToothStatusMeta extends StatusMeta {
  code: string;
}

/**
 * Qabul holatlari (AppointmentStatus)
 */
export const APPOINTMENT_STATUS_MAP: Record<AppointmentStatus, StatusMeta> = {
  SCHEDULED: {
    label: 'Yozilgan',
    color: 'blue',
    badgeStatus: 'processing',
  },
  ARRIVED: {
    label: 'Keldi (kutmoqda)',
    color: 'orange',
    badgeStatus: 'warning',
  },
  IN_PROGRESS: {
    label: 'Qabulda',
    color: 'cyan',
    badgeStatus: 'processing',
  },
  COMPLETED: {
    label: 'Yakunlandi',
    color: 'green',
    badgeStatus: 'success',
  },
  CANCELLED: {
    label: 'Bekor qilindi',
    color: 'default',
    badgeStatus: 'default',
  },
  NO_SHOW: {
    label: 'Kelmadi',
    color: 'red',
    badgeStatus: 'error',
  },
};

/**
 * Tish holatlari (ToothStatus) — FDI xalqaro standart qisqartmalari bilan
 */
export const TOOTH_STATUS_MAP: Record<ToothStatus, ToothStatusMeta> = {
  HEALTHY: {
    label: "Sog'lom",
    code: 'H',
    color: 'default',
  },
  CARIES: {
    label: 'Karies',
    code: 'C',
    color: 'gold',
  },
  FILLED: {
    label: 'Plomba',
    code: 'Pl',
    color: 'blue',
  },
  PULPITIS: {
    label: 'Pulpit',
    code: 'P',
    color: 'volcano',
  },
  PERIODONTITIS: {
    label: 'Periodontit',
    code: 'Pt',
    color: 'red',
  },
  ROOT_ONLY: {
    label: 'Ildiz qolgan',
    code: 'R',
    color: 'purple',
  },
  CROWN: {
    label: 'Toj',
    code: 'K',
    color: 'cyan',
  },
  IMPLANT: {
    label: 'Implant',
    code: 'I',
    color: 'geekblue',
  },
  MISSING: {
    label: "Yo'q",
    code: '0',
    color: 'magenta',
  },
};

/**
 * Tashrif holatlari (VisitStatus)
 */
export const VISIT_STATUS_MAP: Record<VisitStatus, StatusMeta> = {
  OPEN: {
    label: 'Ochiq',
    color: 'processing',
    badgeStatus: 'processing',
  },
  COMPLETED: {
    label: 'Yakunlangan',
    color: 'success',
    badgeStatus: 'success',
  },
};

/**
 * Davolash rejasi holatlari (PlanStatus)
 */
export const PLAN_STATUS_MAP: Record<PlanStatus, StatusMeta> = {
  ACTIVE: {
    label: 'Faol',
    color: 'processing',
    badgeStatus: 'processing',
  },
  COMPLETED: {
    label: 'Yakunlangan',
    color: 'success',
    badgeStatus: 'success',
  },
  CANCELLED: {
    label: 'Bekor qilingan',
    color: 'default',
    badgeStatus: 'default',
  },
};

/**
 * Davolash rejasi bosqichlari (PlanItemStatus)
 */
export const PLAN_ITEM_STATUS_MAP: Record<PlanItemStatus, StatusMeta> = {
  PLANNED: {
    label: 'Rejalashtirilgan',
    color: 'blue',
  },
  DONE: {
    label: 'Bajarildi',
    color: 'green',
  },
  CANCELLED: {
    label: 'Bekor qilindi',
    color: 'default',
  },
};

/**
 * To'lov usullari (PaymentMethod)
 */
export const PAYMENT_METHOD_MAP: Record<PaymentMethod, { label: string }> = {
  CASH: {
    label: 'Naqd',
  },
  CARD: {
    label: 'Karta / Terminal',
  },
  TRANSFER: {
    label: "O'tkazma (Click / Payme)",
  },
};

/**
 * To'lov turlari (PaymentType)
 */
export const PAYMENT_TYPE_MAP: Record<PaymentType, StatusMeta> = {
  PAYMENT: {
    label: "To'lov",
    color: 'green',
  },
  REFUND: {
    label: 'Qaytarish (Refund)',
    color: 'red',
  },
};

/**
 * Tizim rollari (Role)
 */
export const ROLE_MAP: Record<Role, { label: string; description: string }> = {
  ADMIN: {
    label: 'Administrator (Rahbar)',
    description: 'Barcha bo\'limlarga to\'liq kirish huquqi',
  },
  RECEPTIONIST: {
    label: 'Registrator',
    description: 'Bemorlar, qabul taqvimi va navbatni boshqarish',
  },
  DOCTOR: {
    label: 'Shifokor',
    description: 'Tibbiy karta, tashriflar va davolash rejalari',
  },
  CASHIER: {
    label: 'Kassir',
    description: 'Kassa, to\'lovlarni qabul qilish va chek chiqarish',
  },
};

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

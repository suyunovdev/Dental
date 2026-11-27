/**
 * Dental platformasi (F-2) — Bemorlar API moduli va soxta (mock) ma'lumotlar
 * Arxitektura va kontrakt:
 * - docs/api.md 4.4-bo'lim (Bemorlar — T-18)
 * - docs/arxitektura.md 7.6-bo'lim (Bemorlar biznes qoidalari)
 * - docs/tz/nurmuhammad-frontend-2.md (T-22 qabul mezonlari)
 */

import { normalizePhone } from '../lib/format';
import type { Role } from '../lib/labels';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  fullName: string;
  birthDate: string | null; // ISO string '1990-05-15'
  gender: 'MALE' | 'FEMALE' | null;
  phone: string; // '+998901234567'
  phone2: string | null;
  address: string | null;
  allergies: string | null; // Allergiya va muhim kasalliklar
  note: string | null;
  isArchived: boolean;
  telegramLinked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientShort {
  id: number;
  fullName: string;
  phone: string;
  birthDate: string | null;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  birthDate?: string | null;
  gender?: 'MALE' | 'FEMALE' | null;
  phone: string;
  phone2?: string | null;
  address?: string | null;
  allergies?: string | null;
  note?: string | null;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  birthDate?: string | null;
  gender?: 'MALE' | 'FEMALE' | null;
  phone?: string;
  phone2?: string | null;
  address?: string | null;
  allergies?: string | null;
  note?: string | null;
}

export interface PatientListParams {
  search?: string;
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
}

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(statusCode: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Kontrakt bo'yicha boshlang'ich soxta (seed) bemorlar ro'yxati
 * Oila a'zolari (bir xil telefon), allergiyasi bor bemorlar va arxivlangan bemorlar bilan
 */
export const INITIAL_MOCK_PATIENTS: Patient[] = [
  {
    id: 1,
    firstName: 'Dilnoza',
    lastName: 'Karimova',
    middleName: 'Sobirovna',
    fullName: 'Karimova Dilnoza Sobirovna',
    birthDate: '1990-04-12',
    gender: 'FEMALE',
    phone: '+998901234567',
    phone2: '+998935554433',
    address: 'Toshkent sh., Yunusobod tumani, 4-mavze, 12-uy',
    allergies: 'Penitsillin va novokainga yuqori sezuvchanlik',
    note: 'Tish milklarida qonash bor, ehtiyotkorlik talab qilinadi',
    isArchived: false,
    telegramLinked: true,
    createdAt: '2026-11-20T08:30:00.000Z',
    updatedAt: '2026-11-25T10:15:00.000Z',
  },
  {
    id: 2,
    firstName: 'Sardor',
    lastName: 'Karimov',
    middleName: 'Rustamovich',
    fullName: 'Karimov Sardor Rustamovich',
    birthDate: '2015-08-20',
    gender: 'MALE',
    phone: '+998901234567', // Karimova Dilnoza bilan bir xil telefon (oila)
    phone2: null,
    address: 'Toshkent sh., Yunusobod tumani, 4-mavze, 12-uy',
    allergies: null,
    note: 'Bolalar tish shifokoriga birinchi marta keldi',
    isArchived: false,
    telegramLinked: false,
    createdAt: '2026-11-21T09:00:00.000Z',
    updatedAt: '2026-11-21T09:00:00.000Z',
  },
  {
    id: 3,
    firstName: 'Jasur',
    lastName: 'Aliyev',
    middleName: 'Anvarovich',
    fullName: 'Aliyev Jasur Anvarovich',
    birthDate: '1985-11-03',
    gender: 'MALE',
    phone: '+998931112233',
    phone2: null,
    address: 'Toshkent vil., Chirchiq sh., Bobur ko\'chasi, 45',
    allergies: 'Lidokain allergiyasi',
    note: 'Implantatsiya rejalashtirilmoqda',
    isArchived: false,
    telegramLinked: true,
    createdAt: '2026-11-22T14:20:00.000Z',
    updatedAt: '2026-11-26T16:40:00.000Z',
  },
  {
    id: 4,
    firstName: 'Malika',
    lastName: 'Usmonova',
    middleName: 'Botirovna',
    fullName: 'Usmonova Malika Botirovna',
    birthDate: '1998-02-14',
    gender: 'FEMALE',
    phone: '+998977778899',
    phone2: '+998909876543',
    address: 'Toshkent sh., Chilonzor tumani, 9-kvartal',
    allergies: null,
    note: 'Breket o\'rnatish bo\'yicha maslahat',
    isArchived: false,
    telegramLinked: false,
    createdAt: '2026-11-23T11:00:00.000Z',
    updatedAt: '2026-11-23T11:00:00.000Z',
  },
  {
    id: 5,
    firstName: 'Olim',
    lastName: 'Nazarov',
    middleName: 'Qodirovich',
    fullName: 'Nazarov Olim Qodirovich',
    birthDate: '1976-09-30',
    gender: 'MALE',
    phone: '+998946665544',
    phone2: null,
    address: 'Toshkent sh., Mirzo Ulug\'bek tumani',
    allergies: 'Aspirin',
    note: 'Surunkali parodontit',
    isArchived: false,
    telegramLinked: true,
    createdAt: '2026-11-24T12:00:00.000Z',
    updatedAt: '2026-11-24T12:00:00.000Z',
  },
  {
    id: 6,
    firstName: 'Shahnoza',
    lastName: 'Ergasheva',
    middleName: null,
    fullName: 'Ergasheva Shahnoza',
    birthDate: '2001-07-22',
    gender: 'FEMALE',
    phone: '+998912345678',
    phone2: null,
    address: 'Toshkent sh., Sergeli tumani',
    allergies: null,
    note: null,
    isArchived: true, // Arxivdagi bemor
    telegramLinked: false,
    createdAt: '2026-11-15T10:00:00.000Z',
    updatedAt: '2026-11-20T11:00:00.000Z',
  },
];

// Mahalliy xotira (In-memory mock store)
let mockPatientsStore: Patient[] = [...INITIAL_MOCK_PATIENTS];

/**
 * Qidiruv qoidasi (arxitektura.md 7.6-bo'lim):
 * So'zda kamida 3 ta raqam bo'lsa — telefon bo'yicha qidiriladi;
 * aks holda har so'z familiya, ism yoki otasining ismida uchrashi kerak.
 */
function matchSearch(patient: Patient, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  const digits = query.replace(/\D/g, '');
  if (digits.length >= 3) {
    const patientPhoneDigits = patient.phone.replace(/\D/g, '');
    const patientPhone2Digits = patient.phone2 ? patient.phone2.replace(/\D/g, '') : '';
    return patientPhoneDigits.includes(digits) || patientPhone2Digits.includes(digits);
  }

  // Har bir so'z FIO da uchrashi kerak
  const words = query.split(/\s+/).filter(Boolean);
  const fullNameLower = patient.fullName.toLowerCase();
  return words.every((w) => fullNameLower.includes(w));
}

/**
 * 4.4 GET /api/patients
 * Bemorlar ro'yxatini sahifalash va qidiruv bilan qaytarish
 */
export async function getPatients(params?: PatientListParams): Promise<Paginated<Patient>> {
  // Haqiqiy backendga o'xshash 100ms asinxron kechikish
  await new Promise((resolve) => setTimeout(resolve, 100));

  const page = params?.page && params.page > 0 ? params.page : 1;
  const pageSize = params?.pageSize && params.pageSize > 0 ? params.pageSize : 20;
  const includeArchived = params?.includeArchived ?? false;
  const search = params?.search ?? '';

  let filtered = mockPatientsStore.filter((p) => {
    if (!includeArchived && p.isArchived) return false;
    return matchSearch(p, search);
  });

  // Yangi qo'shilganlar yuqorida turishi uchun id bo'yicha kamayish tartibi
  filtered = [...filtered].sort((a, b) => b.id - a.id);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
  };
}

/**
 * 4.4 GET /api/patients/:id
 * Bitta bemor ma'lumotlarini olish
 */
export async function getPatient(id: number): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const found = mockPatientsStore.find((p) => p.id === id);
  if (!found) {
    throw new ApiError(404, 'NOT_FOUND', 'Bemor topilmadi');
  }
  return found;
}

/**
 * 4.4 GET /api/patients/check-phone?phone=
 * Raqam kiritilgach (onBlur) shu raqamda ro'yxatdan o'tgan bemorlarni tekshirish
 */
export async function checkPhone(phone: string): Promise<PatientShort[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  let normalized: string;
  try {
    normalized = normalizePhone(phone);
  } catch {
    return [];
  }

  return mockPatientsStore
    .filter((p) => p.phone === normalized && !p.isArchived)
    .map((p) => ({
      id: p.id,
      fullName: p.fullName,
      phone: p.phone,
      birthDate: p.birthDate,
    }));
}

/**
 * 4.4 POST /api/patients
 * Yangi bemor yaratish
 * Biznes qoidasi (arxitektura.md 7.6):
 * Bir xil telefon VA bir xil familiya + ism bo'lsa -> 409 PATIENT_DUPLICATE
 */
export async function createPatient(data: CreatePatientDto): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  const middleName = data.middleName?.trim() || null;

  if (!firstName || !lastName) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Ism va familiya majburiy');
  }

  let normalizedPhone: string;
  try {
    normalizedPhone = normalizePhone(data.phone);
  } catch (err: unknown) {
    throw new ApiError(400, 'VALIDATION_ERROR', err instanceof Error ? err.message : 'Telefon formati noto\'g\'ri');
  }

  // Dublikat tekshiruvi (arxitektura.md 7.6)
  const isDuplicate = mockPatientsStore.some(
    (p) =>
      p.phone === normalizedPhone &&
      p.firstName.toLowerCase() === firstName.toLowerCase() &&
      p.lastName.toLowerCase() === lastName.toLowerCase()
  );

  if (isDuplicate) {
    const existing = mockPatientsStore.find(
      (p) =>
        p.phone === normalizedPhone &&
        p.firstName.toLowerCase() === firstName.toLowerCase() &&
        p.lastName.toLowerCase() === lastName.toLowerCase()
    );

    throw new ApiError(
      409,
      'PATIENT_DUPLICATE',
      `Bu telefon va ism bilan bemor allaqachon mavjud: ${lastName} ${firstName}`,
      { existingPatientId: existing?.id }
    );
  }

  const fullName = middleName ? `${lastName} ${firstName} ${middleName}` : `${lastName} ${firstName}`;
  const now = new Date().toISOString();

  const newPatient: Patient = {
    id: mockPatientsStore.length ? Math.max(...mockPatientsStore.map((p) => p.id)) + 1 : 1,
    firstName,
    lastName,
    middleName,
    fullName,
    birthDate: data.birthDate || null,
    gender: data.gender || null,
    phone: normalizedPhone,
    phone2: data.phone2 ? normalizePhone(data.phone2) : null,
    address: data.address?.trim() || null,
    allergies: data.allergies?.trim() || null,
    note: data.note?.trim() || null,
    isArchived: false,
    telegramLinked: false,
    createdAt: now,
    updatedAt: now,
  };

  mockPatientsStore = [newPatient, ...mockPatientsStore];
  return newPatient;
}

/**
 * 4.4 PATCH /api/patients/:id
 * Bemor ma'lumotlarini qisman yangilash
 * Rol cheklovi: DOCTOR faqat `allergies` maydonini o'zgartira oladi
 */
export async function updatePatient(
  id: number,
  data: UpdatePatientDto,
  callerRole?: Role
): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const index = mockPatientsStore.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new ApiError(404, 'NOT_FOUND', 'Bemor topilmadi');
  }

  const current = mockPatientsStore[index];

  // DOCTOR faqat allergiya maydonini yangilashi mumkin
  if (callerRole === 'DOCTOR') {
    const updated: Patient = {
      ...current,
      allergies: data.allergies !== undefined ? data.allergies?.trim() || null : current.allergies,
      updatedAt: new Date().toISOString(),
    };
    mockPatientsStore[index] = updated;
    return updated;
  }

  const firstName = data.firstName !== undefined ? data.firstName.trim() : current.firstName;
  const lastName = data.lastName !== undefined ? data.lastName.trim() : current.lastName;
  const middleName = data.middleName !== undefined ? data.middleName?.trim() || null : current.middleName;

  let phone = current.phone;
  if (data.phone !== undefined) {
    phone = normalizePhone(data.phone);
  }

  // Dublikat tekshiruvi (boshqa bemor bilan to'qnashuv)
  if (data.phone !== undefined || data.firstName !== undefined || data.lastName !== undefined) {
    const isDuplicate = mockPatientsStore.some(
      (p) =>
        p.id !== id &&
        p.phone === phone &&
        p.firstName.toLowerCase() === firstName.toLowerCase() &&
        p.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (isDuplicate) {
      throw new ApiError(
        409,
        'PATIENT_DUPLICATE',
        `Bu telefon va ism bilan boshqa bemor mavjud: ${lastName} ${firstName}`
      );
    }
  }

  const fullName = middleName ? `${lastName} ${firstName} ${middleName}` : `${lastName} ${firstName}`;

  const updated: Patient = {
    ...current,
    firstName,
    lastName,
    middleName,
    fullName,
    birthDate: data.birthDate !== undefined ? data.birthDate : current.birthDate,
    gender: data.gender !== undefined ? data.gender : current.gender,
    phone,
    phone2: data.phone2 !== undefined ? (data.phone2 ? normalizePhone(data.phone2) : null) : current.phone2,
    address: data.address !== undefined ? data.address?.trim() || null : current.address,
    allergies: data.allergies !== undefined ? data.allergies?.trim() || null : current.allergies,
    note: data.note !== undefined ? data.note?.trim() || null : current.note,
    updatedAt: new Date().toISOString(),
  };

  mockPatientsStore[index] = updated;
  return updated;
}

/**
 * 4.4 POST /api/patients/:id/archive
 * Bemorni arxivlash (faqat ADMIN)
 */
export async function archivePatient(id: number): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const index = mockPatientsStore.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new ApiError(404, 'NOT_FOUND', 'Bemor topilmadi');
  }

  mockPatientsStore[index] = {
    ...mockPatientsStore[index],
    isArchived: true,
    updatedAt: new Date().toISOString(),
  };

  return mockPatientsStore[index];
}

/**
 * 4.4 POST /api/patients/:id/unarchive
 * Bemorni arxivdan chiqarish (faqat ADMIN)
 */
export async function unarchivePatient(id: number): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const index = mockPatientsStore.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new ApiError(404, 'NOT_FOUND', 'Bemor topilmadi');
  }

  mockPatientsStore[index] = {
    ...mockPatientsStore[index],
    isArchived: false,
    updatedAt: new Date().toISOString(),
  };

  return mockPatientsStore[index];
}

/**
 * Mock ma'lumotlarni boshlang'ich holatga qaytarish (testlar va qayta yuklash uchun)
 */
export function resetMockPatients(): void {
  mockPatientsStore = [...INITIAL_MOCK_PATIENTS];
}

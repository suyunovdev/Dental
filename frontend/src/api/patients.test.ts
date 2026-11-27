import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  archivePatient,
  checkPhone,
  createPatient,
  getPatient,
  getPatients,
  resetMockPatients,
  unarchivePatient,
  updatePatient,
  ApiError,
} from './patients';

describe('Bemorlar API moduli (T-22, api.md 4.4)', () => {
  beforeEach(() => {
    resetMockPatients();
  });

  afterEach(() => {
    resetMockPatients();
  });

  describe('getPatients (bemorlar ro\'yxati va qidiruv)', () => {
    it('bemorlar ro\'yxatini sahifalash bilan qaytaradi', async () => {
      const result = await getPatients({ page: 1, pageSize: 2 });
      expect(result.items.length).toBe(2);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(2);
      expect(result.total).toBeGreaterThanOrEqual(5);
    });

    it('ism yoki familiya bo\'yicha qidiradi (harf registriga bog\'liq emas)', async () => {
      const res1 = await getPatients({ search: 'dilnoza' });
      expect(res1.items.some((p) => p.firstName === 'Dilnoza')).toBe(true);

      const res2 = await getPatients({ search: 'KARIMOVA' });
      expect(res2.items.some((p) => p.lastName === 'Karimova')).toBe(true);
    });

    it('kamida 3 ta raqam bo\'lsa telefon bo\'yicha qidiradi', async () => {
      // 90123 raqami Karimova Dilnoza va Karimov Sardor telefonida bor (+998901234567)
      const res = await getPatients({ search: '90123' });
      expect(res.items.length).toBeGreaterThanOrEqual(2);
      expect(res.items.every((p) => p.phone === '+998901234567')).toBe(true);
    });

    it('arxivlangan bemorlarni odatiy qidiruvdan yashiradi, includeArchived=true da ko\'rsatadi', async () => {
      // Shahnoza Ergasheva (id: 6) boshlang'ich ma'lumotlarda arxivlangan
      const regular = await getPatients({ search: 'Shahnoza', includeArchived: false });
      expect(regular.items.length).toBe(0);

      const withArchived = await getPatients({ search: 'Shahnoza', includeArchived: true });
      expect(withArchived.items.length).toBe(1);
      expect(withArchived.items[0].isArchived).toBe(true);
    });
  });

  describe('checkPhone (bir xil telefon tekshiruvi)', () => {
    it('bir xil raqamga ega barcha bemorlarni (oila a\'zolari) qaytaradi', async () => {
      const matches = await checkPhone('90 123 45 67');
      expect(matches.length).toBe(2);
      const names = matches.map((m) => m.fullName);
      expect(names).toContain('Karimova Dilnoza Sobirovna');
      expect(names).toContain('Karimov Sardor Rustamovich');
    });

    it('mavjud bo\'lmagan yoki xato formatdagi raqam bo\'lsa bo\'sh massiv qaytaradi', async () => {
      const res = await checkPhone('99 999 99 99');
      expect(res).toEqual([]);
    });
  });

  describe('createPatient (yangi bemor qo\'shish)', () => {
    it('telefon raqamini normallashtirib yangi bemor yaratadi', async () => {
      const created = await createPatient({
        firstName: 'Anvar',
        lastName: 'Qosimov',
        phone: '99 123 45 67',
        birthDate: '1992-06-10',
        gender: 'MALE',
        address: 'Toshkent sh.',
      });

      expect(created.id).toBeDefined();
      expect(created.phone).toBe('+998991234567');
      expect(created.fullName).toBe('Qosimov Anvar');
      expect(created.isArchived).toBe(false);

      const fetched = await getPatient(created.id);
      expect(fetched.fullName).toBe('Qosimov Anvar');
    });

    it('bir xil telefon bilan yangi oila a\'zosi qo\'shishga ruxsat beradi (ismi boshqa bo\'lsa)', async () => {
      // +998901234567 raqamida allaqachon Dilnoza va Sardor bor
      const familyMember = await createPatient({
        firstName: 'Nodira',
        lastName: 'Karimova',
        phone: '+998901234567',
      });

      expect(familyMember.id).toBeDefined();
      expect(familyMember.firstName).toBe('Nodira');
      expect(familyMember.phone).toBe('+998901234567');
    });

    it('bir xil telefon VA bir xil ism-familiya bo\'lsa 409 PATIENT_DUPLICATE xatosini tashlaydi', async () => {
      await expect(
        createPatient({
          firstName: 'Dilnoza',
          lastName: 'Karimova',
          phone: '+998901234567', // Mavjud bemor bilan bir xil
        })
      ).rejects.toThrow(ApiError);

      try {
        await createPatient({
          firstName: 'dilnoza', // Kichik harf bilan kiritilsa ham dublikat
          lastName: 'karimova',
          phone: '901234567',
        });
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ApiError);
        const apiErr = err as ApiError;
        expect(apiErr.statusCode).toBe(409);
        expect(apiErr.code).toBe('PATIENT_DUPLICATE');
        expect(apiErr.details?.existingPatientId).toBe(1);
      }
    });

    it('majburiy maydonlar to\'ldirilmaganda 400 VALIDATION_ERROR beradi', async () => {
      await expect(
        createPatient({
          firstName: '',
          lastName: 'Test',
          phone: '901234567',
        })
      ).rejects.toThrow(ApiError);
    });
  });

  describe('updatePatient (bemor ma\'lumotlarini yangilash)', () => {
    it('bemor ma\'lumotlarini to\'g\'ri yangilaydi', async () => {
      const updated = await updatePatient(1, {
        address: 'Yangi manzil: Chilonzor',
        note: 'Yangi izoh qo\'shildi',
      });

      expect(updated.address).toBe('Yangi manzil: Chilonzor');
      expect(updated.note).toBe('Yangi izoh qo\'shildi');
      expect(updated.firstName).toBe('Dilnoza'); // O'zgarmagan maydon saqlanadi
    });

    it('DOCTOR roli tahrirlaganda faqat allergiya maydoni o\'zgaradi, boshqa maydonlar e\'tiborga olinmaydi', async () => {
      const updated = await updatePatient(
        1,
        {
          firstName: 'BuzilganIsm',
          address: 'BuzilganManzil',
          allergies: 'Lidokain allergiyasi qo\'shildi',
        },
        'DOCTOR'
      );

      // Shifokor faqat allergiyani o'zgartira oladi
      expect(updated.allergies).toBe('Lidokain allergiyasi qo\'shildi');
      expect(updated.firstName).toBe('Dilnoza'); // O'zgarmasligi shart
      expect(updated.address).not.toBe('BuzilganManzil');
    });
  });

  describe('archivePatient va unarchivePatient', () => {
    it('bemorni arxivlaydi va arxivdan qaytaradi', async () => {
      const archived = await archivePatient(1);
      expect(archived.isArchived).toBe(true);

      const unarchived = await unarchivePatient(1);
      expect(unarchived.isArchived).toBe(false);
    });
  });
});

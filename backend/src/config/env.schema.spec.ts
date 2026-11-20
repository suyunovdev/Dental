import { describe, it, expect } from 'vitest';
import { validateEnv } from './env.schema.js';

describe('validateEnv', () => {
  it('kerakli env o\'zgaruvchilari bo\'lsa, to\'g\'ri parse qilishi kerak', () => {
    const validEnv = {
      DATABASE_URL: 'postgresql://f2:f2@localhost:5432/f2',
      JWT_ACCESS_SECRET: 'super-secret-key-for-test',
      CLINIC_NAME: 'DentaMed',
      CLINIC_PHONE: '+998901234567',
    };

    const parsed = validateEnv(validEnv);
    expect(parsed.DATABASE_URL).toBe('postgresql://f2:f2@localhost:5432/f2');
    expect(parsed.PORT).toBe(3000);
    expect(parsed.CLINIC_TIMEZONE).toBe('Asia/Tashkent');
  });

  it('majburiy o\'zgaruvchi yo\'q bo\'lsa, xato berib to\'xtashi kerak', () => {
    const invalidEnv = {
      PORT: '3000',
    };

    expect(() => validateEnv(invalidEnv)).toThrowError(
      /JWT_ACCESS_SECRET berilmagan/,
    );
  });
});

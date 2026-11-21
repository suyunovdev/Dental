import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_ACCESS_TTL: z.string().default('15m'),
  REFRESH_TTL_DAYS: z.coerce.number().default(14),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_UPLOAD_MB: z.coerce.number().default(15),
  CLINIC_NAME: z.string().min(1),
  CLINIC_PHONE: z.string().min(1),
  CLINIC_TIMEZONE: z.string().default('Asia/Tashkent'),
  CASHIER_MAX_DISCOUNT_PERCENT: z.coerce.number().default(10),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  SEED_ADMIN_USERNAME: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  GIT_SHA: z.string().default('dev'),
});

export type EnvConfig = z.infer<typeof envSchema>;

const REQUIRED_FIELD_MESSAGES: Record<string, string> = {
  DATABASE_URL: 'DATABASE_URL berilmagan',
  JWT_ACCESS_SECRET: 'JWT_ACCESS_SECRET berilmagan',
  CLINIC_NAME: 'CLINIC_NAME berilmagan',
  CLINIC_PHONE: 'CLINIC_PHONE berilmagan',
};

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => {
        const fieldName = issue.path[0]?.toString() || '';
        if (REQUIRED_FIELD_MESSAGES[fieldName]) {
          return ` - ${REQUIRED_FIELD_MESSAGES[fieldName]}`;
        }
        return ` - ${fieldName || 'O\'zgaruvchi'}: ${issue.message}`;
      })
      .join('\n');
    throw new Error(`\n[ENV XATOSI]: Quyidagi majburiy o'zgaruvchilar to'ldirilmagan:\n${errorMessages}\n`);
  }
  return result.data;
}

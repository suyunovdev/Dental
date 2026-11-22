process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://f2:f2@localhost:5432/f2';
process.env.JWT_ACCESS_SECRET = 'test-secret-at-least-32-characters-long';
process.env.CLINIC_NAME = 'Test Clinic';
process.env.CLINIC_PHONE = '+998901234567';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { hashPassword } from '../src/common/password.js';

describe('Auth API (e2e)', () => {
  let app: INestApplication;
  let passwordHash: string;
  let active = true;
  let nextId = 1;
  const tokens = new Map<string, { id: number; userId: number; revokedAt: Date | null; expiresAt: Date; replacedById?: number }>();
  const user = () => ({ id: 1, fullName: 'Test User', username: 'admin', passwordHash, roles: ['ADMIN'], isActive: active, mustChangePassword: false });
  const prisma = {
    $connect: vi.fn(), $disconnect: vi.fn(),
    pool: { end: vi.fn() },
    user: { findUnique: vi.fn(async () => user()), update: vi.fn() },
    auditLog: { create: vi.fn() },
    refreshToken: {
      create: vi.fn(async ({ data }: { data: { userId: number; tokenHash: string; expiresAt: Date } }) => {
        const record = { id: nextId++, userId: data.userId, revokedAt: null, expiresAt: data.expiresAt };
        tokens.set(data.tokenHash, record);
        return record;
      }),
      findUnique: vi.fn(async ({ where }: { where: { tokenHash: string } }) => {
        const record = tokens.get(where.tokenHash);
        return record ? { ...record, user: user() } : null;
      }),
      updateMany: vi.fn(async ({ where, data }: { where: { id?: number; userId?: number; tokenHash?: string | { not: string }; revokedAt?: null }; data: { revokedAt: Date } }) => {
        let count = 0;
        for (const [hash, record] of tokens) {
          if (where.id !== undefined && record.id !== where.id) continue;
          if (where.userId !== undefined && record.userId !== where.userId) continue;
          if (typeof where.tokenHash === 'string' && hash !== where.tokenHash) continue;
          if (where.revokedAt === null && record.revokedAt !== null) continue;
          record.revokedAt = data.revokedAt;
          count++;
        }
        return { count };
      }),
      update: vi.fn(async ({ where, data }: { where: { id: number }; data: { replacedById: number } }) => {
        const record = [...tokens.values()].find((value) => value.id === where.id);
        if (record) record.replacedById = data.replacedById;
        return record;
      }),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback(prisma)),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    tokens.clear();
    nextId = 1;
    active = true;
    passwordHash = await hashPassword('CorrectPassword123!');
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService).useValue(prisma).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterEach(async () => { await app?.close(); });

  it('login → me → refresh → logout → refresh 401', async () => {
    const server = app.getHttpServer();
    const login = await request(server).post('/api/auth/login').send({ username: 'admin', password: 'CorrectPassword123!' }).expect(200);
    expect(login.body.user.passwordHash).toBeUndefined();
    const cookie = login.headers['set-cookie'][0].split(';')[0];
    await request(server).get('/api/auth/me').set('Authorization', `Bearer ${login.body.accessToken}`).expect(200);
    const refresh = await request(server).post('/api/auth/refresh').set('Cookie', cookie).expect(200);
    const rotatedCookie = refresh.headers['set-cookie'][0].split(';')[0];
    await request(server).post('/api/auth/logout').set('Authorization', `Bearer ${refresh.body.accessToken}`).set('Cookie', rotatedCookie).expect(204);
    await request(server).post('/api/auth/refresh').set('Cookie', rotatedCookie).expect(401);
    expect([...tokens.values()].filter((token) => token.revokedAt === null)).toHaveLength(0);
    expect([...tokens.keys()].every((hash) => /^[0-9a-f]{64}$/.test(hash))).toBe(true);
  });

  it('oltinchi login urinishi 429 qaytaradi', async () => {
    const server = app.getHttpServer();
    for (let i = 0; i < 5; i++) {
      await request(server).post('/api/auth/login').send({ username: 'admin', password: 'wrong' }).expect(401);
    }
    await request(server).post('/api/auth/login').send({ username: 'admin', password: 'wrong' }).expect(429);
  });

  it('bloklangan xodim login va refresh qila olmaydi', async () => {
    const server = app.getHttpServer();
    const login = await request(server).post('/api/auth/login').send({ username: 'admin', password: 'CorrectPassword123!' }).expect(200);
    active = false;
    await request(server).post('/api/auth/login').send({ username: 'admin', password: 'CorrectPassword123!' }).expect(403);
    await request(server).post('/api/auth/refresh').set('Cookie', login.headers['set-cookie'][0].split(';')[0]).expect(403);
  });
});

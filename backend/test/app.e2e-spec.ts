// Env o'zgaruvchilarini AppModule importidan oldin o'rnatamiz
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://f2:f2@localhost:5432/f2';
process.env.JWT_ACCESS_SECRET = 'test-secret-at-least-32-characters-long';
process.env.CLINIC_NAME = 'Test Stom Clinic';
process.env.CLINIC_PHONE = '+998901234567';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const mockPrisma = {
      $connect: vi.fn().mockResolvedValue(undefined),
      $disconnect: vi.fn().mockResolvedValue(undefined),
      $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
      pool: { end: vi.fn().mockResolvedValue(undefined) },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/health (GET) tizim holatini qaytarishi kerak', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('db', 'ok');
        expect(res.body).toHaveProperty('version');
      });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
